import dayjs from 'dayjs';
import {getRandomInteger} from './utils.js';

const getRandomName = () => {
  const names = [
    'David Lynch',
    'Trey Parker',
    'Naomi Watts',
    'Quentin Tarantino',
    'Alfred Hitchcock',
    'Jake Gyllenhaal',
    'Jessica Lange',
    'Sacha Baron Cohen',
    'Elle Fanning',
    'Viggo Mortensen',
  ];

  const randomIndex = getRandomInteger(0, names.length - 1);

  return names[randomIndex];
};

const getRandomText = () => {
  const minSentences = 1;
  const maxSentences = 5;

  const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const getRandomSentence = () => sentences[getRandomInteger(0, sentences.length - 1)];

  return new Array(getRandomInteger(minSentences, maxSentences)).fill().map(() => getRandomSentence()).join(' ');
};

const getRandomDate = () => {
  const daysInterval = -150;
  const day = dayjs().date((getRandomInteger(daysInterval, dayjs().date())));
  return dayjs(day);
};

const getRandomEmotion = () => {
  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  const randomIndex = getRandomInteger(0, emotions.length - 1);

  return emotions[randomIndex];
};

const getRandomComment = () => ({
  author: getRandomName(),
  text: getRandomText(),
  date: getRandomDate(),
  emotion: getRandomEmotion(),
});

const getRandomComments = () => {
  const minComments = 0;
  const maxComments = 5;

  return new Array(getRandomInteger(minComments, maxComments)).fill().map(() => getRandomComment());
};

const getRandomTitle = () => {
  const titles = [
    'Made for Each Other',
    'Popeye Meets Sinbad',
    'Sagebrush Trail',
    'Santa Claus Conquers the Martians',
    'The Dance of Life',
    'The Great Flamarion',
    'The Man with the Golden Arm',
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const getRandomRating = () => `${getRandomInteger(4, 9)}.${getRandomInteger(0, 9)}`;

const getRandomPoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const getRandomAgeRating = () => {
  //не нашел ни в ТЗ, ни в ДЗ какие тут могут быть варианты, поэтому использую свои
  const ageRatings = [
    '0+',
    '6+',
    '16+',
    '18+',
  ];

  const randomIndex = getRandomInteger(0, ageRatings.length - 1);

  return ageRatings[randomIndex];
};

const getRandomWriters = () => {
  const minWriters = 1;
  const maxWriters = 3;

  return new Array(getRandomInteger(minWriters, maxWriters)).fill().map(() => getRandomName());
};

const getRandomActors = () => {
  const minActors = 3;
  const maxActors = 6;

  return new Array(getRandomInteger(minActors, maxActors)).fill().map(() => getRandomName());
};

const getRandomCountry = () => {
  const countries = [
    'Australia',
    'Bosnia and Herzegovina',
    'Cambodia',
    'Iceland',
    'Liechtenstein',
    'United Kingdom',
  ];

  const randomIndex = getRandomInteger(0, countries.length - 1);

  return countries[randomIndex];
};

const getRandomRuntime = () => `${getRandomInteger(1, 3)}h ${getRandomInteger(1, 59)}m`;

const getRandomGenres = () => {
  const minGenres = 1;
  const maxGenres = 3;

  const genres = [
    'Action',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Thriller',
  ];

  const getRandomGenre = () => genres[getRandomInteger(0, genres.length - 1)];

  return new Array(getRandomInteger(minGenres, maxGenres)).fill().map(() => getRandomGenre());
};

const generateWathingDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));
  if (!isDate) {
    return null;
  }
  return getRandomDate();
};

export const getRandomFilm = () => {
  const watchingDate = generateWathingDate();
  const isAlreadyWatched = watchingDate !== null;

  return {
    comments: getRandomComments(),
    title: getRandomTitle(),
    alternativeTitle: getRandomTitle(),
    totalRating: getRandomRating(),
    poster: `images/posters/${getRandomPoster()}`,
    ageRating: getRandomAgeRating(),
    director: getRandomName(),
    writers: getRandomWriters(),
    actors: getRandomActors(),
    releaseDate: getRandomDate('D MMMM YYYY'),
    country: getRandomCountry(),
    runtime: getRandomRuntime(),
    genre: getRandomGenres(),
    description: getRandomText(),
    watchingDate,
    isAlreadyWatched,
    isInWatchlist: Boolean(getRandomInteger()),
    isFavorite: Boolean(getRandomInteger()),
  };
};
