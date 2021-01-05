const url = require("url");
const http = require("http");
const fs = require("fs");

const {
  agregarCandidato,
  consultar,
  eliminarCandidato,
  editar,
  votoSeguro,
  historialDeVotoSeguro,
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

    if (req.url.startsWith("/candidato") && req.method == "PUT") {
      let body = "";
      req.on("data", (datos) => {
        body += datos;
      });
      req.on("end", async () => {
        const { id, name, img } = JSON.parse(body);
        const respuesta = await editar(id, name, img);
        res.end(JSON.stringify(respuesta));
      });
    }

    if (req.url == "/votos" && req.method == "POST") {
      let body = "";
      req.on("data", (datos) => {
        body += datos;
      });
      req.on("end", async () => {
        const { estado, votos, ganador } = JSON.parse(body);
        const result = await votoSeguro(estado, votos, ganador);
        if (result) {
          res.end(JSON.stringify({}));
        } else {
          res.statusCode = 500;
          res.end();
        }
      });
    }

    if (req.url == "/historial" && req.method == "GET") {
      const registros = await historialDeVotoSeguro();
      res.end(JSON.stringify(registros));
    }
  })
  .listen(3000, () => console.log("servidor en puerto 3000"));
