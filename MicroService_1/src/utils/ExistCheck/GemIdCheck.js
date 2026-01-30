const pool = require('../../config/db.config');

const GemIdCheck = async (gem_id) => {

    const query = 'SELECT 1 FROM gem_table WHERE gem_id = $1';

    const {rows} = await pool.query(query, [gem_id]);

    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = GemIdCheck;