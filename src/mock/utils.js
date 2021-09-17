import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomString = (strings) => {
  const randomIndex = getRandomInteger(0, strings.length - 1);

  return strings[randomIndex];
};

export const getRandomStrings = (min, max, strings) => new Array(getRandomInteger(min, max)).fill().map(() => getRandomString(strings));

export const getRandomFishText = () => {
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

export const getRandomDate = () => {
  const daysInterval = -300;
  const day = dayjs().date((getRandomInteger(daysInterval, dayjs().date())));
  return dayjs(day);
};

export const getRandomRating = () => `${getRandomInteger(4, 9)}.${getRandomInteger(0, 9)}`;

export const getRandomRuntime = () => `${getRandomInteger(30, 180)}`;

export const getRandomWatchingDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));
  if (!isDate) {
    return null;
  }
  return getRandomDate();
};
