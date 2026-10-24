const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const allowed = new Set(['index.html','style.css','game.js','whale-rider.html','assets/whale.png','assets/ocean.png']);
http.createServer((req,res) => {
  const name = new URL(req.url,'http://localhost').pathname.slice(1) || 'index.html';
  if (!allowed.has(name)) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(path.join(__dirname,name),(err,data) => {
    if(err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-cache'});
    res.end(data);
  });
}).listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('Whale Rider server listening on port '+(process.env.PORT || 3000)));
