const pool = require("../../../config/db.config");

const ShapeColorFilter = async (gem_id, filter1, filter2, value1, value2, page, limit) => {
    
    const query = `
    SELECT
        eg.each_gem_id,
        eg.lot_number,
        eg.crt,
        eg.price,
        t.image AS thumbnail
    FROM each_gem_detail eg
    LEFT JOIN thumbnail t
        ON t.each_gem_id = eg.each_gem_id
    WHERE eg.gem_id = $1
    AND eg.category = 1
    AND eg.shape_id = $2
    AND eg.color_id = $3
    ORDER BY eg.each_gem_id ASC
    LIMIT $4 OFFSET $5;
    `;

    const { rows } = await pool.query(query, [gem_id, value1, value2, limit, (page - 1) * limit]);
    return rows;
       
}


const ShapeCrtFilter = async (gem_id, filter1, filter2, value1, value2, page, limit) => {

    let startRange  = Math.floor(value2);
    let endRange = Math.ceil(value2);

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
    AND eg.shape_id = $2
    AND eg.crt BETWEEN $3 AND $4
    ORDER BY eg.each_gem_id ASC
    LIMIT $5 OFFSET $6;
`;

    const { rows } = await pool.query(query, [gem_id, value1, startRange, endRange, limit, (page - 1) * limit]);

    return rows;
}


const ColorCrtFilter = async (gem_id, filter1, filter2, value1, value2, page, limit) => {
    let startRange  = Math.floor(value2);
    let endRange = Math.ceil(value2);

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
    AND eg.category = $2
    AND eg.color_id = $3
    AND eg.crt BETWEEN $4 AND $5
    ORDER BY eg.each_gem_id ASC
    LIMIT $6 OFFSET $7;
`;

    const { rows } = await pool.query(query, [gem_id, 1, value1, startRange, endRange, limit, (page - 1) * limit]);

    return rows;
}



module.exports = { ShapeColorFilter, ShapeCrtFilter, ColorCrtFilter };