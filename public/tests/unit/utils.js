module('Unit: Utils');

test('#getDateString', function(assert){
  let date = new Date(2015, 1, 20, 5, 5, 5),
      result = utils.getDateString(date);
  assert.equal('20/02/2015|5|5|5', result);
});

test('#getMonday', function(assert){
  let result = utils.getMonday(new Date(2015, 1, 20)); 
  assert.equal(16, result.getDate());
});

test('#getSunday', function(assert){
  let result = utils.getSunday(new Date(2015, 1, 20)); 
  assert.equal(22, result.getDate());
});

test('#transformDate', function(assert){
  let result = utils.transformDate('27/01/2015'); 
  assert.equal(result, '01/27/2015');
});

test('#transformDateToString', function(assert){
 let result = utils.transformDateToString(new Date(2015, 1, 20)); 
 assert.equal(result, '20/02/2015');
});
