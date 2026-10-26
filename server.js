const express = require('express');
const { createServer } = require('http');
const { ExpressPeerServer } = require('peer');

const PORT = process.env.PORT || 9000;
const app = express();
const server = createServer(app);

app.get('/', (req, res) => res.json({ status: 'ok', service: 'lila-peerjs' }));

const peerServer = ExpressPeerServer(server, {
  path: '/',
    allow_discovery: false,
      proxied: true
      });

      app.use('/peerjs', peerServer);

      server.listen(PORT, () => console.log('PeerJS server on port ' + PORT));