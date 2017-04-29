let arr = [1, 2, 3, 4];

arr = arr.map((item) => {
  if(item === 1){
    item = 2;
  } 
  return item;
});

console.log(arr);
