const http = require('http');

const server = http.createServer((req, res) => {
	if (req.url === "/") {
		res.writeHead(200, {'content-type':'text/html'});
		res.write('<h1>Hello World Vincent !</h1>');
		res.end();
		if (req.method !=== "GET") {
			res.writeHead(403, {'content-type':'text/html'});
			res.write('<h1>403 Méthode non authorisée</h1>');
			res.end();
		}
	}
	else {
		res.writeHead(404, {'content-type':'text/html'});
		res.write('<h1>404 Page Introuvable</h1>');
		res.end();
	}
});

server.listen(5000);
console.log('Server écoute sur le port 5000');
