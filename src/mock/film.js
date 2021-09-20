import { nanoid } from 'nanoid';

import { getRandomString, getRandomFishText, getRandomDate} from './utils.js';

import { NAMES, EMOTIONS} from './const.js';

export const generateComment = () => ({
  id: nanoid(),
  author: getRandomString(NAMES),
  text: getRandomFishText(),
  date: getRandomDate(),
  emotion: getRandomString(EMOTIONS),
});


