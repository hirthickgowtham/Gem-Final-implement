const pool = require('../../../../config/db.config');

const RemoveGemTypeService = async (gem_type_id) => {
    console.log("gem_type_id in service:", gem_type_id);

    const deleteQuery = 'DELETE FROM gem_table WHERE gem_id = $1';

    const {rows} = await pool.query(deleteQuery, [gem_type_id]);
    return rows;
}

module.exports = { RemoveGemTypeService };