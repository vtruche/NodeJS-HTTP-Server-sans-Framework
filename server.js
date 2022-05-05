/*
const http = require('http');

const db = require('./database');

const fs = require('fs');
const path = require('path');

let contenu;
let cheminAbsolu;

const reg = /(\/[api]{1,3}\/[names]{5,9})/;
const reg2 = /(\/[api]{1,3}\/[names]{5,9}\/[0-9])/;

const server = http.createServer((req, res) => {
	try {
		if (req.url === "/") {
			res.writeHead(200, {'content-type':'text/html'});
			// res.write('<h1>Hello World Vincent !');
			// cheminAbsolu = path.join(__dirname , 'public/pages/index.html');
			// contenu = fs.readFilesSync(cheminAbsolu, "utf-8");
			// res.write(contenu);
			res.end();
			if (req.method !== "GET") {
				res.writeHead(403, {'content-type':'text/html'});
				res.write('<h1>403 Méthode non authorisée</h1>');
				res.end();
			}
		}
		else if(reg.exec(req.url) !== null) { //req.url === '/api/names'
			res.writeHead(200, {'content-type':'text/html'});
			if(reg2.exec(req.url) !== null) {
				if (req.method === "GET") {
					const url = req.url.split('/');
					const id = parseInt(url[url.length -1]);
					res.write('<h1>' + db.get(id).nom + '</h1>');
				}
				else if (req.method === "DELETE") {
					res.writeHead(201, {'content-type':'text/html'});
					db.delete(id);
					res.write('<h1>Utilisateur ' + db.get(id).nom + ' a bien été supprimé</h1>');
					res.write('<h4>La base a été mise à jour :</h4>')
					res.write('<ul>');
					db.forEach(n => {
						res.write('<li>' + n.nom + '</li>' );
					});
					res.write('</ul>');
					res.end();
				}
			}
			else {
			  	res.write('<ul>');
			  	db.forEach(n => {
					res.write('<li>' + n.nom + '</li>' );
			  	});
			  	res.write('</ul>');
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
*/

const http = require("http");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const mapToObj = (m) => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

const server = http.createServer((req, res) => {
  try {
    if (req.url === "/api/names") {
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(mapToObj(db["memoryDb"])));
        res.end();
      } else if (req.method === "POST") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          try {
            if (typeof data === undefined) {
              throw "bad request";
            } else {
              data = JSON.parse(data);
              if (!("name" in data)) {
                throw "bad request - test";
              }
              let currentId = db["id"];
              db["memoryDb"].set(db["id"]++, data);
              res.writeHead(201, { "content-type": "application/json" });
              res.write(JSON.stringify(db["memoryDb"].get(currentId)));
              res.end();
            }
          } catch (err) {
            console.log(err);
            res.writeHead(400, { "content-type": "application/json" });
            res.write(
              JSON.stringify({error:"nop"})
            );
            res.end();
          }
        });
      } else {
        res.writeHead(405, { "content-type": "application/json" });
        res.write(
          JSON.stringify({error:"nop"})
        );
        res.end();
      }
    } else if (req.url.match(/\/api\/name\/*/)) {
      const split = req.url.split("/");
      const targetId = parseInt(split[split.length - 1]);
      if (!db["memoryDb"].has(targetId)) {
        res.writeHead(404, { "content-type": "application/json" });
        res.write(
          JSON.stringify({error:"nop"})
        );
        res.end();
      } else if (req.method === "GET") {
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(db["memoryDb"].get(targetId)));
        res.end();
      } else if (req.method === "DELETE") {
        db["memoryDb"].delete(targetId);
        res.writeHead(204);
        res.end();
      } else if (req.method === "PUT") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          try {
            if (typeof data === undefined) {
              throw "bad request";
            } else {
              data = JSON.parse(data);
              if (!("name" in data)) {
                throw "bad request - test";
              }
              db["memoryDb"].set(targetId, data);
              res.writeHead(204);
              res.end();
            }
          } catch (err) {
            console.log(err);
            res.writeHead(400, { "content-type": "application/json" });
            res.write(
              JSON.stringify({error:"nop"})
            );
            res.end();
          }
        });
      } else {
        res.writeHead(405, { "content-type": "application/json" });
        res.write(
          JSON.stringify({error:"nop"})
        );
        res.end();
      }
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.write(
      JSON.stringify({error:"nop"})
    );
    res.end();
  }
});

module.exports = server;