const pool = require('../../config/db.config');


const HeroSectionChecker = async (id) =>{

    const query = `
    SELECT 1 FROM 
    hero_section
    WHERE id = $1;
    `;

    const {rows} = await pool.query(query,[id]);


    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = HeroSectionChecker;