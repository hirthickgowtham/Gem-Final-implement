const pool = require('../../../config/db.config');


const GemListFilterService = async (category, gem_id, page, limit) => {

    const query = `
    SELECT
        eg.each_gem_id,
        eg.lot_number,
        eg.crt,
        t.image AS thumbnail
    FROM each_gem_detail eg
    LEFT JOIN thumbnail t
        ON t.each_gem_id = eg.each_gem_id
    WHERE eg.gem_id = $1
    AND eg.category = $2
    ORDER BY eg.each_gem_id DESC
    LIMIT $3 OFFSET $4;
    `;

    const {rows} = await pool.query(query, [Number(gem_id), category, limit, (page - 1) * limit]);

    return rows;
}




module.exports = { GemListFilterService };