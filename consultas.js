const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "esmeralda",
  database: "elecciones",
  port: 5432,
});

const agregarCandidato = async (datos) => {
  console.log(datos);
  const consultaIngreso = {
    text:
      "INSERT INTO candidatos (nombre, foto, color) VALUES ($1, $2, $3) RETURNING *;",
    values: datos,
  };
  try {
    const resultado = await pool.query(consultaIngreso);
    console.log(resultado.rows);
    return resultado;
  } catch (error) {
    console.log(error.code);
  }
};

const consultar = async () => {
  const consulta = "SELECT * FROM candidatos";
  try {
    const res = await pool.query(consulta);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const eliminarCandidato = async (dato) => {
  const consulta = {
    text: "DELETE from candidatos where id=$1",
    values: [dato],
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (error) {
    console.log(error.code);
    console.log(error);
  }
};

const editar = async (name, img, id) => {
  const consulta = {
    text:
      "UPDATE candidatos SET nombre = $1, foto = $2 WHERE id = $3 RETURNING *",
    values: name,
    img,
    id,
  };

  try {
    const result = await pool.query(consulta);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { agregarCandidato, consultar, eliminarCandidato, editar };
