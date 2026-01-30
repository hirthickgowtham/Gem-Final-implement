const pool = require('../../config/db.config');


const ColorIdCheck = async (colorId) => {

    const query = 'SELECT 1 FROM colour WHERE color_id = $1';

    const {rows} = await pool.query(query, [colorId]);

    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = ColorIdCheck;