import dayjs from 'dayjs';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortByDate = (a, b) => dayjs(b.releaseDate).diff(dayjs(a.releaseDate));
export const sortByRating = (a, b) => b.totalRating - a.totalRating;
