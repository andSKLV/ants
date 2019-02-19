function GetRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function GetCell(field, x, y) {
  return field[y][x];
}
export { GetRandom, GetCell };
