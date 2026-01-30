const pool = require("../../../config/db.config");


const shapeIdFilterCount = async (gem_id, category, value) => {

    const query = `
    SELECT COUNT(*) AS total
    FROM each_gem_detail
    WHERE gem_id = $1
    AND category = $2
    AND shape_id = $3;
    `;

    const {rows} = await pool.query(query,[gem_id, category, value]);


    return rows[0];
}



const ColorIdFilterCount = async (gem_id, category, value) => {

    const query = `
    SELECT COUNT(*) AS total
    FROM each_gem_detail
    WHERE gem_id = $1
    AND category = $2
    AND color_id = $3;
    `;

    const {rows} = await pool.query(query,[gem_id, category, value]);

    console.log(rows[0]);

    return rows[0];

}


const CrtFilterCount = async (gem_id, category, value) => {

    let startRange  = Math.floor(value);
    let endRange = Math.ceil(value);

    if(startRange === endRange){
        endRange = startRange + 1;
    }


    const query = `
        SELECT
            COUNT(*) AS total
        FROM each_gem_detail
        WHERE gem_id = $1
        AND category = $2
        AND crt BETWEEN $3 AND $4;
    `;

    const {rows} = await pool.query(query, [gem_id, category, startRange, endRange]);    

    return rows[0];

}



module.exports = { shapeIdFilterCount, ColorIdFilterCount, CrtFilterCount };