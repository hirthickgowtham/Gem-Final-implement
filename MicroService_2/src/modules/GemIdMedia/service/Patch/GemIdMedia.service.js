const pool = require("../../../../config/db.config");

const GemIdMediaService = async (gem_id, media_url) => {

    const query = `
    UPDATE gem_table
    SET general_gem_image = $1
    WHERE gem_id = $2
    RETURNING gem_id, general_gem_image;
    `;

    const {rows} = await pool.query(query, [media_url, gem_id]);

    return rows;
}

module.exports = {
    GemIdMediaService
}