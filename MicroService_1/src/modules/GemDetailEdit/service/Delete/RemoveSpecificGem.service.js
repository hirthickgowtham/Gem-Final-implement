const pool = require('../../../../config/db.config');

const RemoveSpecificGemService = async (gem_id) => {

    console.log("Removing gem with ID:", gem_id);
    const deleteQuery = 'DELETE FROM each_gem_detail WHERE each_gem_id = $1';
    const {rows} = await pool.query(deleteQuery, [gem_id]);

    return rows;    
}

module.exports = { RemoveSpecificGemService };