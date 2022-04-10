const http = require('http');
const fs = require('fs');
const url = require('url');
const {ingresar, consultaUsuarios, eliminar, editar, registrarTransferencia, mostrarTransferencias} = require('./querys.js')
const port = 3000;

http.createServer(async (req, res) =>{

    if (req.url == '/' && req.method == 'GET') {
        res.setHeader('content-type', 'text/html');
        const html = fs.readFileSync('index.html', 'utf8');
        res.end(html);
      }

      if ((req.url == '/usuario' && req.method == 'POST')) {
        let body = "";
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          const datos = Object.values(JSON.parse(body));
          const respuesta = await ingresar(datos);
          res.end(JSON.stringify(respuesta));
        });
      }

      if (req.url == '/usuarios' && req.method == 'GET') {
        const registros = await consultaUsuarios();
        res.end(JSON.stringify(registros));
      }

    if (req.url.startsWith('/usuario') && req.method == 'DELETE') {
        const { id } = url.parse(req.url, true).query;
        const respuesta = await eliminar(id);
        res.end(JSON.stringify(respuesta));
    
      }

      if (req.url.startsWith('/usuario') && req.method == 'PUT') {
        let body = "";
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          const datos = Object.values(JSON.parse(body));
          const respuesta = await editar(datos);
          res.end(JSON.stringify(respuesta));
        });
      }

      if ((req.url == '/transferencia' && req.method == 'POST')) {
        let body = "";
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          const datos = Object.values(JSON.parse(body));
          const respuesta = await registrarTransferencia(datos);
          res.end(JSON.stringify(respuesta));
        });
      }

      if (req.url == '/transferencias' && req.method == 'GET') {
        const registros = await mostrarTransferencias();
        res.end(JSON.stringify(registros));
      }

}).listen(port, () => console.log(`Servidor a la escucha en el puerto ${port}`));