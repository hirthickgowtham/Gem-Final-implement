const pool = require('../../../../config/db.config');


const RemoveColorService = async (color_id) => {

    const deleteQuery = 'DELETE FROM colour WHERE color_id = $1';

    const {rows} = await pool.query(deleteQuery, [color_id]);
    return rows;

}

module.exports = { RemoveColorService };