const pool = require('../../../../config/db.config');

const ColorNameEditService = async (color_id, color_name) => {


    const query = 'UPDATE colour SET color_name = $1 WHERE color_id = $2';

    const values = [color_name, color_id];
    const { rows } = await pool.query(query, values);
    return rows[0];

}


module.exports = { ColorNameEditService };