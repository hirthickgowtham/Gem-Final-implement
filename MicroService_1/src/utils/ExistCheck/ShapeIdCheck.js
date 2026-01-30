const pool = require('../../config/db.config');

const ShapeIdCheck = async (shapeId) => {
    const query = 'SELECT 1 FROM shape_table WHERE shape_id = $1';

    const {rows} = await pool.query(query, [shapeId]);

    if(rows.length === 0){
        return false;
    }

    return true;
}

module.exports = ShapeIdCheck;