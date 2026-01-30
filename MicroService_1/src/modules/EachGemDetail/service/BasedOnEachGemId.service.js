const pool = require('../../../config/db.config');

const BasedOnEachGemIdService = async (each_gem_id) => {
    const query = `
    SELECT * FROM vw_each_gem_full_detail
    WHERE each_gem_id = $1;
    `;

    const { rows } = await pool.query(query, [each_gem_id]);
    return rows;
}

module.exports = {
    BasedOnEachGemIdService
};