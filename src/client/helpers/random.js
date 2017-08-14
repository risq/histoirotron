export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randItemFromArray(array) {
  return array[randBetween(0, array.length - 1)];
}
