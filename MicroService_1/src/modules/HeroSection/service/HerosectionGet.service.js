const pool = require("../../../config/db.config");


const HeroSectionGetService = async () => {

    const query = `
    SELECT * FROM hero_section;`;

    const { rows } = await pool.query(query);

    return rows;
}

module.exports = { HeroSectionGetService };