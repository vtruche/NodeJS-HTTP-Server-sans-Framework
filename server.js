const http = require('http');

const server = http.createServer((req, res) => {
	if (req.url === "/") {
		res.writeHead(200, {'content-type':'text/html'});
		res.write('<h1>Hello World Vincent !</h1>');
		res.end();
	}
});

server.listen(5000);
console.log('Server écoute sur le port 5000');
