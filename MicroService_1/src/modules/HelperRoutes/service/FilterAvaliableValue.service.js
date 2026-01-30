const pool = require('../../../config/db.config');

const ShapeValueHandler = async () => {
    const query = `SELECT * FROM shape_table;`;

    const {rows} = await pool.query(query);
    return rows;
}

const ColorValueHandler = async () => {
    const query = `SELECT * FROM colour;`;

    const {rows} = await pool.query(query);
    return rows;
}


module.exports = {
    ShapeValueHandler,
    ColorValueHandler
};