import dayjs from 'dayjs';

export const sortByDate = (a, b) => dayjs(b.releaseDate).diff(dayjs(a.releaseDate));
export const sortByRating = (a, b) => b.totalRating - a.totalRating;
