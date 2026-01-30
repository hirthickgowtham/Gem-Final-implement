const pool = require('../../../config/db.config');


const ShapeBasedFilter = async (shape_id, category, gem_id, page, limit) => {
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
    AND eg.shape_id = $3
    ORDER BY eg.each_gem_id ASC
    LIMIT $4 OFFSET $5;
    `;

    const {rows} = await pool.query(query, [Number(gem_id), category, shape_id, limit, (page - 1) * limit]); 
    
    console.log(rows);

    return rows;
}


const ColorBasedFilter = async (color_id, category, gem_id, page, limit) => {

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
    ORDER BY eg.each_gem_id ASC
    LIMIT $4 OFFSET $5;
    `;

    const {rows} = await pool.query(query, [Number(gem_id), category, color_id, limit, (page - 1) * limit]);

    console.log(rows);

    return rows;

}



const CrtBasedFilter = async (crt, category, gem_id, page, limit) => {

    let startRange  = Math.floor(crt);
    let endRange = Math.ceil(crt);

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
        AND eg.crt BETWEEN $3 AND $4
        ORDER BY eg.each_gem_id ASC
        LIMIT $5 OFFSET $6;
    `;

    const {rows} = await pool.query(query, [Number(gem_id), category, startRange, endRange, limit, (page - 1) * limit]);    

    return rows;

}



module.exports = { ShapeBasedFilter, ColorBasedFilter, CrtBasedFilter };