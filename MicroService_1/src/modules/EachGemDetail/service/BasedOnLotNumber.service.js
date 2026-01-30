const pool = require('../../../config/db.config');

const BasedOnLotNumberService = async (lot_number) => {
    const query = `
    SELECT * FROM vw_each_gem_full_detail
    WHERE lot_number = $1;
    `;

    const { rows } = await pool.query(query, [lot_number]);
    return rows;
}

module.exports = {
    BasedOnLotNumberService
};