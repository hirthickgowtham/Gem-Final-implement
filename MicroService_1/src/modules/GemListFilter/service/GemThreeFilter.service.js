const pool = require('../../../config/db.config');

const ThreeFilter = async (gem_id, filter1, filter2, filter3, page, limit) => {

    let startRange = Math.floor(filter3);
    let endRange = Math.ceil(filter3);

    if(startRange === endRange){
        endRange = startRange + 1;
    }

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
    AND eg.category = 1
    AND eg.color_id = $2
    AND eg.shape_id = $3
    AND eg.crt BETWEEN $4 AND $5
    ORDER BY eg.each_gem_id ASC
    LIMIT $6 OFFSET $7;
    `;

    const {rows} = await pool.query(query, [gem_id, filter1, filter2, startRange, endRange, limit, (page - 1) * limit]);
    return rows;
}

module.exports = { ThreeFilter };