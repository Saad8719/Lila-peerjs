const express = require('express');
const { createServer } = require('http');
const { ExpressPeerServer } = require('peer');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mon_secret_de_test_123';
const PORT = process.env.PORT || 9000;

const app = express();
const server = createServer(app);

app.get('/', (req, res) => res.json({ status: 'ok', service: 'lila-peerjs' }));

function authMiddleware(req, res, next) {
const token = req.query.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
if (!token) return res.status(401).json({ error: 'Token manquant' });
try {
req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
next();
} catch (e) {
return res.status(401).json({ error: 'Token invalide' });
}
}

server.on('upgrade', (req, socket) => {
try {
const url = new URL(req.url, 'http://localhost');
const token = url.searchParams.get('token');
if (!token) throw new Error('No token');
jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
} catch (e) {
socket.destroy();
}
});

const peerServer = ExpressPeerServer(server, {
path: '/',
allow_discovery: false,
proxied: true
});

app.use('/peerjs', authMiddleware);
app.use('/peerjs', peerServer);

server.listen(PORT, () => console.log('PeerJS server on port ' + PORT));