import Anthropic from '@anthropic-ai/sdk'
import type { Scored } from './great-dream-detect'

/**
 * great-dream-reader — LA COUPE, et le droit de se taire.
 *
 * Le relief (`great-dream-detect.ts`) sait CLASSER. Il ne sait pas dire NON :
 * il y aura toujours un premier du classement, même dans un corpus plat. C'est
 * ici qu'on refuse, et c'est la seule raison d'être de cette couche.
 *
 * ── LA QUESTION POSÉE AU MODÈLE, ET POURQUOI ELLE EST FORMULÉE AINSI ────────
 * On NE demande PAS « est-ce un grand rêve ? ». Ce serait un verdict de l'app
 * sur le rêve de quelqu'un — exactement ce que le canon interdit (1_BIBLE
 * §3.13.2 : « un rêve initiatique serait un verdict de l'app SUR le rêve ;
 * "ça m'a changé" est un témoignage du rêveur sur lui-même. Seul le second est
 * légitime »). Le modèle ne peut donc pas être juge de grandeur.
 *
 * On lui demande une chose plus étroite et vérifiable : **y a-t-il là une scène
 * qui pourrait encore compter pour cette personne dans dix ans ?** C'est le
 * *carry-over effect* de Bulkeley posé au futur — un fait sur la persistance,
 * pas une interprétation du sens.
 *
 * Et ce qu'il rend n'est pas une raison : c'est **l'IMAGE**, nommée dans les
 * termes du rêve. C'est l'épistrophè de Hillman — on revient à l'image, on ne
 * la développe pas en signification. Le contraire serait l'erreur d'Hercule :
 * descendre aux enfers et remonter les figures au grand jour à coups de massue
 * interprétative. L'app pose l'image devant le rêveur et se tait ; c'est lui
 * qui reconnaît, ou pas (Aizenstat : laisser les figures marcher sur leurs
 * propres jambes).
 *
 * Dégradation : toute panne rend `null`. L'appelant ne propose alors RIEN —
 * jamais un repli sur le classement brut. Un candidat non lu n'est pas un
 * candidat : le silence est le comportement sûr.
 *
 * Yeshua (Opus, agent B3), 2026-07-26.
 */

const MODEL = 'claude-sonnet-4-6'
const TEXT_CHARS = 3000

export type ReaderVerdict = { id: string; image: string }

const SYSTEM = `Tu lis les rêves d'une seule personne, dans son journal, des mois ou des années après qu'elle les a rêvés.

On te donne quelques-uns de ses rêves. Pour chacun, UNE question, et une seule :

**Y a-t-il là-dedans une scène qui pourrait encore compter pour elle dans dix ans ?**

Pas « est-ce un beau rêve ». Pas « est-ce un rêve important ». Pas « qu'est-ce que ça veut dire ». Uniquement : est-ce qu'il y a là une scène qui ne s'efface pas — une image qu'on porte, une chose qui est arrivée dans ce rêve et qui continue d'arriver.

## Réponds NON par défaut
La plupart des rêves, même vifs, même longs, même pleins de symboles, ne contiennent pas ça. Ils passent. C'est normal et c'est bien.
- Rendre une liste VIDE est une bonne réponse, et souvent la bonne. Ce n'est pas un échec.
- Ne garde jamais un rêve parce qu'il est le plus fort du lot. Le lot peut être entièrement ordinaire.
- Ne cherche pas à en garder un certain nombre. Zéro, un, deux — selon ce qu'il y a.

## Ce qui n'est PAS une scène qui compte
- Le commentaire du rêveur sur son propre projet de journal : « il faut vraiment que j'enregistre mes rêves », « premier rêve de mes 30 ans », « j'aimerais en enregistrer 3560 ». C'est du cadrage, pas du rêve. Une entrée qui n'est QUE ça : non.
- Le rêveur qui commente son propre talent ou ses qualités.
- Une accumulation de scènes sans qu'aucune ne tienne debout toute seule.
- Un rêve du quotidien à peine déformé.

## Le corpus est de la dictée vocale brute
Transcription fautive, phrases coupées, mots déformés, préambules parlés, et parfois PLUSIEURS rêves dans une même entrée. Juge la matière onirique seulement. Si une entrée contient plusieurs rêves, retiens celui qui tient, et c'est LUI que tu nommes.

## Ce que tu rends pour chaque rêve gardé : L'IMAGE, pas le sens
Une phrase courte, au présent, qui NOMME CE QUI SE PASSE DANS LE RÊVE. Rien d'autre. Reste dans les mots et les images du rêve, au plus près de ce qui est raconté.

BIEN (exemples volontairement étrangers à ce journal — ne t'en sers que pour la FORME) :
- « La porte de la maison d'enfance ouvre sur une pièce qu'il n'avait jamais vue. »
- « Un cheval attend au bord de la route, immobile, et ne repart pas. »
- « L'eau monte dans l'escalier pendant qu'on continue de parler d'autre chose. »

MAL — et ce sont des fautes graves :
- « Ce rêve parle de ta peur de lâcher prise. » (tu dis ce que ça veut dire)
- « L'enfant symbolise ta part créatrice. » (tu traduis)
- « Tu cherches ta place. » (tu parles du rêveur)
- « Un rêve d'initiation puissant. » (tu juges le rêve au lieu de le montrer)
- « Une scène marquante et inoubliable. » (tu qualifies au lieu de nommer)

Interdits absolus : dire ce que le rêve veut dire · relier le rêve à la vie du rêveur · psychologiser · rassurer · conseiller · poser une question · employer les mots « symbolise », « représente », « inconscient », « c'est-à-dire », « initiatique », « archétype », « numineux ».

Tu montres. Tu ne traduis pas. La personne reconnaîtra toute seule — c'est tout l'intérêt.

Réponds STRICTEMENT en JSON, sans texte autour :
{"kept":[{"id":"<uuid exact>","image":"<une phrase, ce qui se passe dans le rêve>"}]}
Aucun rêve ne porte une telle scène → {"kept":[]}`

function buildUser(cands: Scored[]): string {
  const blocks = cands.map((c, i) => {
    const d = new Date(c.row.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    const body = (c.row.raw_text || '').replace(/\s+/g, ' ').trim()
    return [
      `### ${i + 1}. id=${c.row.id}`,
      `Rêvé le ${d}`,
      c.row.title ? `Titre donné après coup : ${c.row.title}` : '',
      `Texte : ${body.slice(0, TEXT_CHARS)}${body.length > TEXT_CHARS ? ' […]' : ''}`,
    ].filter(Boolean).join('\n')
  })
  return `## Les rêves à lire (${cands.length})\n\n${blocks.join('\n\n')}\n\nLesquels portent une scène qui pourrait encore compter dans dix ans ? Rappelle-toi : la liste vide est une bonne réponse, et c'est souvent la bonne.`
}

/** Mots qui trahissent une traduction plutôt qu'une image. Filet de sécurité
 *  dur, en plus de la consigne — la consigne seule tient à ~85 % (mesuré A3 §4). */
const FORBIDDEN = [
  'symbolise', 'représente', 'inconscient', 'c\'est-à-dire', 'initiatique',
  'archétyp', 'numineux', 'signifie', 'veut dire', 'métaphore', 'ton besoin',
  'ta peur', 'tu cherches', 'tu es en',
]

export function imageIsClean(image: string): boolean {
  const s = image.toLowerCase()
  if (s.length < 12 || s.length > 260) return false
  return !FORBIDDEN.some(f => s.includes(f))
}

/**
 * Le second mode. **Mesuré, pas supposé** (RAPPORT-B3 §2.3) : le verdict de
 * `readCandidates` est RELATIF AU LOT — le même rêve est gardé dans un lot de 6
 * et écarté dans un lot de 12. Sa sévérité est donc juste pour la proposition
 * hebdomadaire NON SOLLICITÉE, où un faux positif coûte cher (on dérange
 * quelqu'un pour rien), et trop sévère pour la **première review**, que le
 * rêveur a lui-même demandée : là, c'est LUI le filtre, et le faux négatif coûte
 * plus cher que le faux positif — un rêve jamais montré ne sera jamais reconnu.
 *
 * Ce mode-ci ne juge donc pas la grandeur. Il fait deux choses seulement :
 *   • nommer l'image (même contrat d'intégrité, mêmes interdits) ;
 *   • écarter ce qui n'est PAS un rêve relisable — entrée de pur commentaire
 *     sur le journal, fragment, test. C'est une question factuelle, sur laquelle
 *     un modèle est fiable.
 */
const SYSTEM_NAME = `Tu lis les rêves d'une seule personne, dans son journal. Elle t'a demandé de lui remontrer ceux qui ressortent de son historique : c'est ELLE qui décidera lesquels comptent, pas toi.

Ton travail n'est PAS de juger si un rêve est important. Il est de faire deux choses.

## 1. Nommer l'image de chaque rêve
Une phrase courte, au présent, qui NOMME CE QUI SE PASSE DANS LE RÊVE. Rien d'autre. Reste dans les mots et les images du rêve, au plus près de ce qui est raconté. S'il y a plusieurs rêves dans une entrée, nomme celui qui tient le mieux debout.

BIEN (exemples volontairement étrangers à ce journal — ne t'en sers que pour la FORME) :
- « La porte de la maison d'enfance ouvre sur une pièce qu'il n'avait jamais vue. »
- « Un cheval attend au bord de la route, immobile, et ne repart pas. »
- « L'eau monte dans l'escalier pendant qu'on continue de parler d'autre chose. »

MAL — fautes graves :
- « Ce rêve parle de ta peur de lâcher prise. » (tu dis ce que ça veut dire)
- « L'enfant symbolise ta part créatrice. » (tu traduis)
- « Tu cherches ta place. » (tu parles du rêveur)
- « Un rêve d'initiation puissant. » / « Une scène marquante. » (tu juges au lieu de montrer)

Interdits absolus : dire ce que le rêve veut dire · relier le rêve à la vie du rêveur · psychologiser · rassurer · conseiller · poser une question · employer les mots « symbolise », « représente », « inconscient », « c'est-à-dire », « initiatique », « archétype », « numineux ».

## 2. Écarter ce qui n'est pas un rêve relisable
Écarte UNIQUEMENT, et sans hésiter :
- les entrées qui ne sont que du commentaire sur le journal lui-même (« il faut vraiment que j'enregistre mes rêves », « premier rêve de mes 30 ans, j'aimerais en enregistrer 3560 ») sans récit de rêve derrière ;
- les fragments trop courts ou trop décousus pour qu'on puisse en nommer une image ;
- les notes de journée qui ne sont pas des rêves.

Tout le reste, tu le gardes et tu le nommes. Le doute profite au rêve : dans le doute, garde.

Le corpus est de la dictée vocale brute — transcription fautive, phrases coupées, préambules parlés. Ce n'est pas un motif d'écarter.

Réponds STRICTEMENT en JSON, sans texte autour :
{"kept":[{"id":"<uuid exact>","image":"<une phrase, ce qui se passe dans le rêve>"}]}`

async function ask(system: string, cands: Scored[]): Promise<ReaderVerdict[] | null> {
  if (!cands.length) return []
  if (!process.env.ANTHROPIC_API_KEY) return null
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1400,
      temperature: 0.2, // on reconnaît, on ne compose pas
      system,
      messages: [{ role: 'user', content: buildUser(cands) }],
    })
    const part = res.content.find((c: any) => c.type === 'text')
    const text = part && part.type === 'text' ? part.text : ''
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return null
    const parsed = JSON.parse(m[0])
    const valid = new Set(cands.map(c => c.row.id))
    return (Array.isArray(parsed.kept) ? parsed.kept : [])
      .filter((k: any) => k && valid.has(k.id) && typeof k.image === 'string' && imageIsClean(k.image))
      .map((k: any) => ({ id: String(k.id), image: String(k.image).trim() }))
  } catch (e) {
    console.error('[great-dream-reader]', e)
    return null
  }
}

/** Proposition hebdomadaire NON sollicitée : le modèle a le droit — et le devoir —
 *  de tout écarter. `[]` est une réponse fréquente et attendue. */
export function readCandidates(cands: Scored[]): Promise<ReaderVerdict[] | null> {
  return ask(SYSTEM, cands)
}

/** Première review, SOLLICITÉE par le rêveur : on nomme les images et on
 *  n'écarte que ce qui n'est pas un rêve. C'est lui le filtre. */
export function nameCandidates(cands: Scored[]): Promise<ReaderVerdict[] | null> {
  return ask(SYSTEM_NAME, cands)
}
