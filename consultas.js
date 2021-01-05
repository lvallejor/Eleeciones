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

const editar = async (id, nombre, foto) => {
  const consulta = {
    text: "UPDATE candidatos SET nombre = $2, foto = $3 WHERE id = $1",
    values: [id, nombre, foto],
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const votoSeguro = async (estado, votos, ganador) => {
  const insertVote = {
    text: "INSERT INTO historial (estado, votos, ganador) VALUES ($1, $2, $3)",
    values: [estado, votos, ganador],
  };
  const updateVote = {
    text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2",
    values: [votos, ganador],
  };
  try {
    await pool.query("BEGIN");
    await pool.query(insertVote);
    await pool.query(updateVote);
    await pool.query("COMMIT");
    return true;
  } catch (e) {
    await pool.query("ROLLBACK");
    return false;
  }
};

const historialDeVotoSeguro = async () => {
  try {
    const consulta = {
      text: "SELECT * FROM historial",
      rowMode: "array",
    };
    const result = await pool.query(consulta);
    return result.rows;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};
module.exports = {
  agregarCandidato,
  consultar,
  eliminarCandidato,
  editar,
  votoSeguro,
  historialDeVotoSeguro,
};
