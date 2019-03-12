function GetRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function GetRandomElFromArray(arr) {
  const i = GetRandom (0, arr.length-1);
  return arr[i];
}
export { GetRandom, GetRandomElFromArray};
