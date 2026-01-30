const pool = require('../../../config/db.config');

const ThreeFilterCountHandler = async (gem_id, shape_id, color_id, crt) => {

    let startRange = Math.floor(crt);
    let endRange = Math.ceil(crt);

    if(startRange === endRange){
        endRange = startRange + 1;
    }

    const query = `
    SELECT COUNT(*) AS total
    FROM each_gem_detail
    WHERE gem_id = $1
    AND category = 1
    AND shape_id = $2
    AND color_id = $3
    AND crt BETWEEN $4 AND $5;
    `;

    const { rows} = await pool.query(query, [gem_id, shape_id, color_id, startRange, endRange]);

    return rows[0];
}

module.exports = {
    ThreeFilterCountHandler
};