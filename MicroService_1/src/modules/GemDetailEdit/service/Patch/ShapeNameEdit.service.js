const pool = require('../../../../config/db.config');

const ShapeNameEditService = async (shape_id, shape_name) => {

    const query = 'UPDATE shape_table SET shape_name = $1 WHERE shape_id = $2';

    const values = [shape_name, shape_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}


module.exports = { ShapeNameEditService };