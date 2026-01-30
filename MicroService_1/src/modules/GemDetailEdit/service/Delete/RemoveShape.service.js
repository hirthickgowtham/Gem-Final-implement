const pool = require('../../../../config/db.config');


const RemoveShapeService = async (shape_id) => {
    console.log("Delete Shape Service is called", shape_id); 

    const deleteQuery = 'DELETE FROM shape_table WHERE shape_id = $1';

    const {rows} = await pool.query(deleteQuery, [shape_id]);
    return rows;
}


module.exports = {
    RemoveShapeService
};