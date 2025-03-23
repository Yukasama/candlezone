import { randomInt } from 'd3-random';

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
];

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
];

/**
 * Generates a random name using a combination of adjectives, nouns, and numbers
 * @returns A randomly generated name
 */
export const generateName = () => {
  const adjective = NAME_ADJECTIVES[randomInt(NAME_ADJECTIVES.length)()];
  const noun = NAME_NOUNS[randomInt(NAME_NOUNS.length)()];
  const numbers = String(randomInt(1000, 90001)());

  return `${adjective}-${noun}-${numbers}`;
};
