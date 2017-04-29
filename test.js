let arr = [1, 2, 3, 4];

let result = arr.reduce((prev, curr, index, array) => {
  return prev + curr;
}, 0);
console.log(result);
