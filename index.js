const url = require("url");
const http = require("http");
const fs = require("fs");

const {
  agregarCandidato,
  consultar,
  eliminarCandidato,
  editar,
} = require("./consultas");

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");
      const html = fs.readFileSync("index.html", "utf8");
      res.end(html);
    }

    if (req.url === "/candidato" && req.method == "POST") {
      let body = "";
      req.on("data", (datos) => {
        body += datos;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        const result = await agregarCandidato(datos);
        res.end(JSON.stringify(result));
      });
    }

    if (req.url == "/candidatos" && req.method == "GET") {
      const registros = await consultar();
      res.end(JSON.stringify(registros));
    }

    if (req.url === "/candidato" && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;
      const registros = await eliminarCandidato(id);
      res.end(JSON.stringify(registros));
    }

    if (req.url == "/candidatos" && req.method == "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const { name, img, id } = JSON.parse(body);
        const respuesta = await editar(name, img, id);
        res.end(JSON.stringify(respuesta));
      });
    }
  })
  .listen(3000, () => console.log("servidor en puerto 3000"));
