const pool = require('../../config/db.config');

const EachGemIdCheck = async (gem_id) => {

    const query = `
    SELECT 1 FROM 
    vw_each_gem_full_detail
    WHERE each_gem_id = $1;
    `;

    const {rows} = await pool.query(query,[gem_id]);

    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = {
    EachGemIdCheck
};