let fs = require('fs'),
    jsdom = require('jsdom'),
    htmlSource = fs.readFileSync("index.html", "utf8");

jsdom.env(htmlSource, (err, window) => {
  let app = window.document.getElementById('ember-app');
  fs.readdir('./templates', (err, filenames) => {
    let fileContent;
    filenames.forEach((fileName) => {
      app.innerHTML += fs.readFileSync(`./templates/${fileName}`); 
    });
    fs.writeFileSync('./compiled.html', window.document.documentElement.outerHTML);
  });
});
