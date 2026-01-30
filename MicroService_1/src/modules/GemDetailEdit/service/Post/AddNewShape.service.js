const pool = require('../../../../config/db.config');


const AddNewShapeService = async (shapeName) => {
    console.log("AddNewShapeService called with shapeName:", shapeName);

    const query = `INSERT INTO shape_table (shape_name) VALUES ($1) RETURNING *`;

    const { rows } = await pool.query(query, [shapeName]);
    return rows[0];
}

module.exports = {
    AddNewShapeService
};
