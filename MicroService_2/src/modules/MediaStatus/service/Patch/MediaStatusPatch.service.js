const pool = require('../../../../config/db.config');

/**
 * Updates the processing status of a specific media_id
 * @param {number} media_id 
 * @param {boolean} status 
 */
const MediaStatusPatchService = async (media_id, status) => {
    const query = `
        UPDATE media_status
        SET status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE media_id = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [media_id, status]);
    return rows[0] || null;
};

module.exports = { MediaStatusPatchService };
