var fs = require('fs');
/*
var config = {testing: "marcell",
              another: "this is another thing"};
fs.writeFileSync('test.json', JSON.stringify(config));
*/
var json = JSON.parse(fs.readFileSync('config.json'));
console.log('json: ', json.accessKeyId);
