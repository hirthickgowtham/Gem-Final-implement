const pool = require('../../config/db.config');


const MediaIdCheck = async (media_id) => {
    
    const query = `
    SELECT COUNT(*) = array_length($1::int[], 1) AS all_exist
    FROM media_table
    WHERE media_id = ANY($1::int[]);
    `;

    const {rows} = await pool.query(query,[media_id]);

    if(rows.length === 0){
        return false;
    }

    return rows[0].all_exist;
}

module.exports = {
    MediaIdCheck
};