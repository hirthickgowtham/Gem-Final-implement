const pool = require('../../../../config/db.config');


const AddNewColorService = async (colorName) => {
    console.log("AddNewColorService called with colorName:", colorName);

    const query = `INSERT INTO colour (color_name) VALUES ($1) RETURNING *`;

    const {rows} = await pool.query(query, [colorName]);
    return rows[0];
}

module.exports = {
    AddNewColorService
};