const pool = require("../../../../config/db.config");

const HeroSectionPostService = async ({title, description, image_url}) => {

    const  query = `
    INSERT INTO hero_section (title, description, image_url)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;

    const value = [title, description, image_url];

    const {rows} = await pool.query(query,value);

    return rows;
}

module.exports = {
    HeroSectionPostService
};

