const pool = require("../../../../config/db.config");

const HeroSectionDeleteService = async ({HeroId}) =>{
    const query = `
    DELETE FROM hero_section WHERE id = $1 
    RETURNING *;`;

    const {rows} = await pool.query(query,[HeroId]);

    return rows;
}

module.exports = {
    HeroSectionDeleteService
};