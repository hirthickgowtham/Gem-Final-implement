const pool = require('../../../config/db.config');




const ShapeColorCount = async (gem_id, value1, value2) => {
    const  query = `
    SELECT COUNT(*) AS total
    FROM each_gem_detail
    WHERE gem_id = $1
    AND category = 1
    AND shape_id = $2
    AND color_id = $3;
    `;

    const {rows} = await pool.query(query, [gem_id, value1, value2]);

    console.log(rows[0]);

    return rows[0];
}

const ShapeCrtCount = async (gem_id, value1, value2) => {
    let startRange  = Math.floor(value2);
    let endRange = Math.ceil(value2);

    if(startRange === endRange){
        endRange = startRange + 1;
    }

    const  query = `
    SELECT COUNT(*) AS total
    FROM each_gem_detail
    WHERE gem_id = $1
    AND category = 1
    AND shape_id = $2
    AND crt BETWEEN $3 AND $4;
    `;

    const {rows} = await pool.query(query, [gem_id, value1, startRange, endRange]);

    console.log(rows[0]);

    return rows[0];
}

const ColorCrtCount = async (gem_id, value1, value2) => {
    let startRange  = Math.floor(value2);
    let endRange = Math.ceil(value2);

    if(startRange === endRange){
        endRange = startRange + 1;
    }       

    const query = `
    SELECT COUNT(*) AS total
    FROM each_gem_detail
    WHERE gem_id = $1
    AND category = 1
    AND color_id = $2
    AND crt BETWEEN $3 AND $4;
    `;

    const {rows} = await pool.query(query, [gem_id, value1, startRange, endRange]);

    console.log(rows[0]);

    return rows[0];
}


module.exports = {
    ShapeColorCount,
    ShapeCrtCount,
    ColorCrtCount
};