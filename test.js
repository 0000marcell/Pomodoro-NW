let currentDate = new Date().getFullYear()
let number = 2015;
let diff = currentDate - number + 1;
console.log('diff: ', diff);
let arr = Array.from(new Array(diff), (x,i) => i + number);
console.log('arr: ', arr);
