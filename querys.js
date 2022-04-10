const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bancosolar',
    password: 'admin',
    port: 5432
});

const ingresar = async (datos) => {
    const consulta = {
        text: "INSERT INTO usuarios(nombre,balance) values ($1, $2) RETURNING *;",
        values: datos,
    }
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (err) {
        console.log('Error: ', err);
        return err;

    }
};

const consultaUsuarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        return result;
    } catch (err) {
        console.log('Error: ', err);
        return err;
    }
}


const eliminar = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`);
        return result;
    } catch (err) {
        console.log('Error: ', err);
    }
}

const editar = async (datos) => {
    const consulta = {
        text: `UPDATE usuarios SET nombre = $2, balance = $3 where id = $1 RETURNING *;`,
        values: datos,
    }
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (err) {
        console.log('Error: ', err);
        return err;
    }
}


const registrarTransferencia = async (data) => {
    const values = Object.values(data);
    const nombreEmisor = values[0];
    const nombreReceptor = values[1];
    const monto = values[2];


    const registrarTransferenciaHistorial = {
        text: "insert into transferencias (emisor,receptor,monto,fecha) values ((select id from usuarios where nombre = $1), (select id from usuarios where nombre = $2), $3, current_timestamp)",
        values:[nombreEmisor,nombreReceptor,Number(monto)],
    };

    const emisor = {
        text: 'update usuarios set balance = balance - $2 where id = (select id from usuarios where nombre = $1);',
        values: [nombreEmisor, Number(monto)]
    }

    const receptor = {
        text: 'update usuarios set balance = balance + $2 where id = (select id from usuarios where nombre = $1);',
        values: [nombreReceptor, Number(monto)]
    }

    try {
        await pool.query('BEGIN');
        await pool.query(registrarTransferenciaHistorial);
        await pool.query(emisor);
        await pool.query(receptor);
        await pool.query('COMMIT');
        return true;
    } catch (error) {
        await pool.query('ROLLBACK');
        return error.code;
    }

}

const mostrarTransferencias = async () => {
    try {
        const transacciones = {
            text:'SELECT fecha,(SELECT nombre AS emisor FROM usuarios WHERE usuarios.id = transferencias.emisor),(SELECT nombre AS receptor FROM usuarios WHERE usuarios.id = transferencias.receptor), monto FROM transferencias INNER JOIN usuarios ON transferencias.emisor = usuarios.id',
            rowMode:"array"
        };

        const result = await pool.query(transacciones);
        return result.rows;

    } catch (error) {
        console.log(error.code);
        return error;
    }
}


module.exports = { ingresar, consultaUsuarios, eliminar, editar, registrarTransferencia,mostrarTransferencias } 