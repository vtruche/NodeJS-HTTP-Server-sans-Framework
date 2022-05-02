const http = require('http');

const server = http.createServer((req, res) => {
	try {
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
	}
	catch (err) {
		res.writeHead(500, {'content-type':'text/html'});
		res.write('<h1>500 Erreur Interne au Serveur</h1>');
		res.end();
	}
});

server.listen(5000);
console.log('Server écoute sur le port 5000');
