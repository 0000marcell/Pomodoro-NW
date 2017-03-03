let fs = require('fs'),
    jsdom = require('jsdom');

param = process.argv[2];

if(param =='test'){
  baseFile = './tests.html'
}else{
  baseFile = './app.html'
}

let htmlSource = fs.readFileSync(baseFile, "utf8");

jsdom.env(htmlSource, (err, window) => {
  let app = window.document.getElementById('ember-app');
  app.innerHTML = "";
  fs.readdir('./templates', (err, filenames) => {
    let fileContent;
    filenames.forEach((fileName) => {
      app.innerHTML += fs.readFileSync(`./templates/${fileName}`); 
    });
    fs.writeFileSync(baseFile, window.document.documentElement.outerHTML);
  });
});
