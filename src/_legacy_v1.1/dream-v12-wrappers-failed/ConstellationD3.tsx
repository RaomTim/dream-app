'use client'

/**
 * ConstellationD3 — V1.2
 *
 * Graphe d3-force vivant : drift léger, particules ambient, hover/click, drag.
 * Cœur de Portrait, AnimaVoute, Cercle.
 *
 * Format nodes : [{ id, label?, kind: "self|figure|kairos|bigdream|member|holding", weight?, holding? }]
 * Format edges : [{ source, target, alive? }]
 *
 * d3-force est dynamiquement importé côté client uniquement (pas SSR).
 * S'il échoue à charger, le composant rend une grille statique (fallback).
 */

import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

export type NodeKind = 'self' | 'figure' | 'kairos' | 'bigdream' | 'member' | 'holding'

export interface ConstellationNode {
  id: string
  label?: string
  weight?: number
  kind?: NodeKind
  holding?: boolean
  /** Position fixe (optionnelle) */
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

export interface ConstellationEdge {
  source: string | ConstellationNode
  target: string | ConstellationNode
  alive?: boolean
}

export interface ConstellationD3Props {
  nodes: ConstellationNode[]
  edges: ConstellationEdge[]
  focalId?: string
  width?: number
  height?: number
  onNodeClick?: (node: ConstellationNode) => void
  driftParticles?: boolean
  showLabels?: boolean
  className?: string
  style?: CSSProperties
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  delay: number
}

// d3-force loaded once, lazily, in the client
let d3ForcePromise: Promise<typeof import('d3-force')> | null = null
function loadD3Force() {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'))
  if (!d3ForcePromise) {
    d3ForcePromise = import('d3-force').catch(err => {
      d3ForcePromise = null
      throw err
    })
  }
  return d3ForcePromise
}

export default function ConstellationD3({
  nodes: initialNodes,
  edges: initialEdges,
  focalId,
  width: propW,
  height: propH,
  onNodeClick,
  driftParticles = true,
  showLabels = true,
  className = '',
  style,
}: ConstellationD3Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: propW || 600, h: propH || 400 })
  const [, setTick] = useState(0)
  const [d3Loaded, setD3Loaded] = useState(false)
  const [d3FailedToLoad, setD3FailedToLoad] = useState(false)

  // Measure container if no explicit size
  useEffect(() => {
    if (propW && propH) return
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setSize({ w: r.width || propW || 600, h: r.height || propH || 400 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [propW, propH])

  // Refs to live nodes/edges (mutated by d3 simulation)
  const simRef = useRef<unknown>(null)
  const nodesRef = useRef<ConstellationNode[]>([])
  const edgesRef = useRef<ConstellationEdge[]>([])

  // Identity hash to retrigger sim only on actual structure change
  const nodesKey = useMemo(() => initialNodes.map(n => n.id).join('|'), [initialNodes])
  const edgesKey = useMemo(
    () => initialEdges.map(e => `${typeof e.source === 'string' ? e.source : e.source?.id}-${typeof e.target === 'string' ? e.target : e.target?.id}`).join('|'),
    [initialEdges]
  )

  useEffect(() => {
    let cleanup: (() => void) | null = null
    let cancelled = false

    loadD3Force().then(d3 => {
      if (cancelled) return
      setD3Loaded(true)

      // Deep-copy nodes & edges so d3 can mutate freely
      const nodes: ConstellationNode[] = initialNodes.map(n => ({ ...n }))
      const edges: ConstellationEdge[] = initialEdges.map(e => ({ ...e }))

      const byId = new Map(nodes.map(n => [n.id, n]))
      edges.forEach(e => {
        if (typeof e.source === 'string') e.source = byId.get(e.source) as ConstellationNode
        if (typeof e.target === 'string') e.target = byId.get(e.target) as ConstellationNode
      })

      // Force-cast to the d3-force-simulation node datum shape (ConstellationNode is structurally compatible)
      const sim = d3.forceSimulation(nodes as unknown as Parameters<typeof d3.forceSimulation>[0])
        .force('link', d3.forceLink(edges as unknown as Parameters<typeof d3.forceLink>[0])
          .id((d) => (d as ConstellationNode).id)
          .distance((d) => ((d as unknown as ConstellationEdge).alive ? 80 : 95))
          .strength(0.4))
        .force('charge', d3.forceManyBody().strength(d => (d as ConstellationNode).kind === 'bigdream' ? -260 : -130))
        .force('center', d3.forceCenter(size.w / 2, size.h / 2).strength(0.06))
        .force('collide', d3.forceCollide().radius(d => ((d as ConstellationNode).kind === 'bigdream' ? 32 : 20)).strength(0.85))
        .alpha(0.9)
        .alphaDecay(0.025)

      // Focal pinning
      if (focalId) {
        const f = byId.get(focalId)
        if (f) { f.fx = size.w / 2; f.fy = size.h / 2 }
      }

      nodesRef.current = nodes
      edgesRef.current = edges
      simRef.current = sim

      let raf = 0
      let last = 0
      sim.on('tick', () => {
        const now = performance.now()
        if (now - last < 16) return
        last = now
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => setTick(t => t + 1))
      })

      cleanup = () => { sim.stop(); cancelAnimationFrame(raf) }
    }).catch(err => {
      console.warn('[ConstellationD3] d3-force not available — fallback static layout.', err)
      if (!cancelled) setD3FailedToLoad(true)
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesKey, edgesKey, size.w, size.h, focalId])

  // Drag (only if d3 loaded)
  const dragRef = useRef<{ node: ConstellationNode; start: { x: number; y: number } } | null>(null)
  const onMouseDown = (e: React.MouseEvent, n: ConstellationNode) => {
    if (!simRef.current || !d3Loaded) return
    n.fx = n.x ?? null; n.fy = n.y ?? null
    ;(simRef.current as { alphaTarget: (a: number) => { restart: () => void } }).alphaTarget(0.3).restart()
    dragRef.current = { node: n, start: { x: e.clientX, y: e.clientY } }
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.start.x
      const dy = ev.clientY - dragRef.current.start.y
      n.fx = (n.x ?? 0) + dx
      n.fy = (n.y ?? 0) + dy
    }
    const up = () => {
      if (n.id !== focalId) { n.fx = null; n.fy = null }
      ;(simRef.current as { alphaTarget: (a: number) => void }).alphaTarget(0)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      dragRef.current = null
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  // Drift particles
  const particles = useMemo<Particle[]>(() => {
    if (!driftParticles) return []
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      r: 1 + Math.random() * 1.2,
      delay: Math.random() * 8,
    }))
  }, [driftParticles])

  const [particleTick, setParticleTick] = useState(0)
  useEffect(() => {
    if (!driftParticles) return
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      if (t - last > 40) { setParticleTick(p => p + 1); last = t }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [driftParticles])

  useEffect(() => {
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > 1) p.vx *= -1
      if (p.y < 0 || p.y > 1) p.vy *= -1
    })
  }, [particleTick, particles])

  // Static fallback layout (if d3 fails) — circular
  const staticLayout = useMemo(() => {
    if (d3Loaded || !d3FailedToLoad) return null
    const cx = size.w / 2, cy = size.h / 2
    const r = Math.min(size.w, size.h) / 2.5
    return initialNodes.map((n, i) => {
      if (n.id === focalId) return { ...n, x: cx, y: cy }
      const angle = (i / initialNodes.length) * 2 * Math.PI
      return { ...n, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
    })
  }, [d3Loaded, d3FailedToLoad, initialNodes, focalId, size.w, size.h])

  const renderNodes = staticLayout ?? nodesRef.current
  const renderEdges = staticLayout
    ? initialEdges.map(e => {
        const s = staticLayout.find(n => n.id === (typeof e.source === 'string' ? e.source : e.source?.id))
        const t = staticLayout.find(n => n.id === (typeof e.target === 'string' ? e.target : e.target?.id))
        return { ...e, source: s as ConstellationNode, target: t as ConstellationNode }
      })
    : edgesRef.current

  const edgePath = (e: ConstellationEdge) => {
    const s = e.source as ConstellationNode
    const t = e.target as ConstellationNode
    const sx = s?.x, sy = s?.y, tx = t?.x, ty = t?.y
    if (sx == null || sy == null || tx == null || ty == null) return ''
    const mx = (sx + tx) / 2, my = (sy + ty) / 2
    const dx = tx - sx, dy = ty - sy
    const nx = -dy, ny = dx
    const len = Math.hypot(nx, ny) || 1
    const curve = 0.12
    const cx = mx + (nx / len) * Math.hypot(dx, dy) * curve
    const cy = my + (ny / len) * Math.hypot(dx, dy) * curve
    return `M ${sx} ${sy} Q ${cx} ${cy}, ${tx} ${ty}`
  }

  const nodeRadius = (n: ConstellationNode) => n.kind === 'bigdream' ? 18 : (n.kind === 'self' ? 14 : 11)

  return (
    <div ref={wrapRef} className={`constellation-d3 ${className}`.trim()} style={style}>
      <svg ref={svgRef} viewBox={`0 0 ${size.w} ${size.h}`}>
        <g className="edges">
          {renderEdges.map((e, i) => (
            <path key={i} className={`edge ${e.alive ? 'alive' : ''}`} d={edgePath(e)} />
          ))}
        </g>

        {driftParticles && (
          <g className="particles">
            {particles.map(p => (
              <circle
                key={p.id}
                className="particle"
                cx={p.x * size.w}
                cy={p.y * size.h}
                r={p.r}
                style={{ opacity: 0.3 + 0.4 * Math.sin((particleTick + p.delay * 10) * 0.05) }}
              />
            ))}
          </g>
        )}

        <g className="nodes">
          {renderNodes.map(n => {
            const r = nodeRadius(n)
            const cls = `node ${n.kind || ''} ${n.id === focalId ? 'focal' : ''} ${n.holding ? 'holding' : ''}`.trim()
            return (
              <g
                key={n.id}
                className={cls}
                transform={`translate(${n.x ?? 0}, ${n.y ?? 0})`}
                onMouseDown={(e) => onMouseDown(e, n)}
                onClick={() => onNodeClick?.(n)}
                style={{ cursor: 'pointer' }}
              >
                <circle className="halo" r={r * 1.8} />
                <circle className="core" r={r} />
                {n.label && showLabels && (
                  <text y={r + 14}>{n.label}</text>
                )}
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
