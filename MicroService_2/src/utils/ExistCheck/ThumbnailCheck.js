const pool = require('../../config/db.config');


const ThumbnailChecker = async (each_gem_id) =>{

    const query = `
    SELECT 1 FROM 
    thumbnail
    WHERE each_gem_id = $1;
    `;

    const {rows} = await pool.query(query,[each_gem_id]);

    console.log(rows);

    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = ThumbnailChecker;