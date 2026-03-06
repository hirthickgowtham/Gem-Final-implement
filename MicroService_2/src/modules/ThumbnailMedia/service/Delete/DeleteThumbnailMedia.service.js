const pool = require("../../../../config/db.config");


const DeleteThumbnailMediaService = async (each_gem_id) =>{

    const query = `
    DELETE FROM thumbnail
    WHERE each_gem_id = $1
    RETURNING each_gem_id, image;`;

    const {rows} = await pool.query(query,[each_gem_id]);

    return rows[0];
}

module.exports = {
    DeleteThumbnailMediaService
};