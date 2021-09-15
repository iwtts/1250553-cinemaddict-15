import { nanoid } from 'nanoid';

import { getRandomInteger, getRandomString, getRandomStrings, getRandomFishText, getRandomDate, getRandomRating, getRandomRuntime, getRandomWatchingDate } from './utils.js';

import { NAMES, EMOTIONS, TITLES, POSTERS, AGE_RATINGS, COUNTRIES, GENRES } from './const.js';

export const generateComment = () => ({
  id: nanoid(),
  author: getRandomString(NAMES),
  text: getRandomFishText(),
  date: getRandomDate(),
  emotion: getRandomString(EMOTIONS),
});

const generateComments = (min, max) => new Array(getRandomInteger(min, max)).fill().map(() => generateComment());

export const generateFilm = () => {
  const watchingDate = getRandomWatchingDate();
  const isAlreadyWatched = watchingDate !== null;

  return {
    id: nanoid(),
    comments: generateComments(0, 5),
    title: getRandomString(TITLES),
    alternativeTitle: getRandomString(TITLES),
    totalRating: getRandomRating(),
    poster: `images/posters/${getRandomString(POSTERS)}`,
    ageRating: getRandomString(AGE_RATINGS),
    director: getRandomString(NAMES),
    writers: getRandomStrings(2, 3, NAMES),
    actors: getRandomStrings(3, 6, NAMES),
    releaseDate: getRandomDate(),
    releaseCountry: getRandomString(COUNTRIES),
    runtime: getRandomRuntime(),
    genres: getRandomStrings(1, 3, GENRES),
    description: getRandomFishText(),
    isInWatchList: Boolean(getRandomInteger()),
    isAlreadyWatched,
    watchingDate,
    isFavorite: Boolean(getRandomInteger()),
  };
};
