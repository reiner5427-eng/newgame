const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname,name),'utf8');
let js=read('game.js');
for(const name of ['whale','ocean']){
 const uri='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'assets',name+'.png')).toString('base64');
 js=js.replace('assets/'+name+'.png',uri);
}
const html=read('index.html').replace('<link rel="stylesheet" href="style.css">','<style>'+read('style.css')+'</style>').replace('<script src="game.js"></script>','<script>'+js+'</script>');
fs.writeFileSync(path.join(__dirname,'whale-rider.html'),html);
console.log('Built whale-rider.html with embedded graphics');
