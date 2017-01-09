let arr = [1, 2, 3, 4, 5];
let newArr = [];
arr.forEach(function(value){
  newArr.push(value);
  if(value === 3){
    break;
  }
});
console.log('new Arr: ', newArr);
