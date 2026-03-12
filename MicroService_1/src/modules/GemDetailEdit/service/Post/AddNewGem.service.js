const pool = require('../../../../config/db.config');

const AddNewGemService = async ({gem_name,gem_division}) => {
    const query = `
        INSERT INTO gem_table (gem_name, division, general_gem_image)
        VALUES ($1, $2, $3)
        RETURNING gem_id;
    `;

    const value = [gem_name, gem_division, "Dummy_Image"];

    const {rows} = await pool.query(query, value);
    return rows[0]; 

}

module.exports = {
    AddNewGemService
};