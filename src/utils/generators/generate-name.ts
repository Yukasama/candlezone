import { randomInt } from 'crypto'

const NAME_ADJECTIVES = [
  'cool',
  'kind',
  'calm',
  'bold',
  'wise',
  'neat',
  'fair',
  'glad',
  'keen',
  'rare',
  'pure',
  'warm',
  'wild',
  'firm',
  'fast',
  'deep',
  'vast',
  'soft',
  'hard',
  'rich',
]

const NAME_NOUNS = [
  'star',
  'rose',
  'wind',
  'flame',
  'wave',
  'stone',
  'leaf',
  'snow',
  'rain',
  'fire',
  'tree',
  'bird',
  'wolf',
  'bear',
  'lion',
  'fish',
  'frog',
  'hawk',
  'dear',
  'moon',
]

export const generateName = () => {
  const adjective = NAME_ADJECTIVES[randomInt(NAME_ADJECTIVES.length)]
  const noun = NAME_NOUNS[randomInt(NAME_NOUNS.length)]
  const numbers = randomInt(1000, 90001).toString()

  return `${adjective}-${noun}-${numbers}`
}
