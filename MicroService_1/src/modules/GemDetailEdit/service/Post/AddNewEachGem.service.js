const pool = require('../../../../config/db.config');


const AddNewGemService = async (gemDetails) => {
    console.log(gemDetails);
    const query = `
    INSERT INTO each_gem_detail (
        lot_number,
        crt,
        number_of_gems,
        gem_id,
        category,
        color_id,
        shape_id,
        description,
        price
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING each_gem_id;
    `;

    const values = [
        gemDetails.lot_number,
        Number(gemDetails.crt),
        Number(gemDetails.number_of_gems),
        Number(gemDetails.gem_id),
        Number(gemDetails.category),
        Number(gemDetails.color_id),
        Number(gemDetails.shape_id),
        gemDetails.description,
        Number(gemDetails.price)
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];

}

module.exports = {
    AddNewGemService
};