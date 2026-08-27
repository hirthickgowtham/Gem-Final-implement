const pool = require('../../../../config/db.config');

/**
 * Deletes a media status record
 * @param {number} media_id 
 */
const MediaStatusDeleteService = async (media_id) => {
    const query = `
        DELETE FROM media_status
        WHERE media_id = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [media_id]);
    return rows[0] || null;
};

module.exports = { MediaStatusDeleteService };
