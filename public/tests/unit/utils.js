module('Unit: Utils');

test('#getDateString', function(assert){
  let date = new Date(2015, 1, 20, 5, 5, 5),
      result = utils.getDateString(date);
  assert.equal('20/02/2015|5|5|5', result);
});
