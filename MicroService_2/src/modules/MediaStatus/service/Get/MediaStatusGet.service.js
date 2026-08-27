const pool = require('../../../../config/db.config');

/**
 * Retrieves the processing status of a specific media_id
 * @param {number} media_id 
 */
const MediaStatusGetService = async (media_id) => {
    const query = `
        SELECT media_id, status, created_at, updated_at
        FROM media_status
        WHERE media_id = $1;
    `;
    const { rows } = await pool.query(query, [media_id]);
    return rows[0] || null;
};

module.exports = { MediaStatusGetService };
