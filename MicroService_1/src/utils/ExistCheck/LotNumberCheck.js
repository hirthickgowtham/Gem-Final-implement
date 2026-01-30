const pool = require('../../config/db.config');

const LotNumberCheck = async (lot_number) => {

    const query = `
    SELECT 1 FROM 
    vw_each_gem_full_detail
    WHERE lot_number = $1;
    `;

    const {rows} = await pool.query(query,[lot_number]);

    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = {
    LotNumberCheck
};