let fs = require('fs'),
    jsdom = require('jsdom'),
    exec = require('child_process').exec;

let param = process.argv[2],
    baseDir = './public',
    templatesDir = `${baseDir}/templates`,
    outFile = `${baseDir}/index.html`

if(param =='test'){
  baseFile = `${baseDir}/tests.html`
}else{
  baseFile = `${baseDir}/app.html`
}

let htmlSource = fs.readFileSync(baseFile, "utf8");

console.log('Compiling...');

jsdom.env(htmlSource, (err, window) => {
  let app = window.document.getElementById('ember-app');
  app.innerHTML = "";
  fs.readdir(templatesDir, (err, filenames) => {
    let fileContent;
    filenames.forEach((fileName) => {
      app.innerHTML += fs.readFileSync(`${templatesDir}/${fileName}`); 
    });
    fs.writeFileSync(outFile, window.document.documentElement.outerHTML);
  });
});

console.log(`Compiled html in ${baseFile}`);
console.log('Running nw js!');

exec('~/bin/nwsdk.app/Contents/MacOS/nwjs ./public', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
