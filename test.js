let obj = { 
  get(){
    console.log('get!!!');
  } 
};

if(obj.hasOwnProperty('get')){
  console.log('has property!');
}else{
  console.log('dont have property');
}
