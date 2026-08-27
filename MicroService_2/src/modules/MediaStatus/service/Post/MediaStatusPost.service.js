const pool = require('../../../../config/db.config');

/**
 * Creates or initializes a media status record
 * @param {number} media_id 
 * @param {string} status - 'pending' | 'ready' | 'failed'
 */
const MediaStatusPostService = async (media_id, status = 'pending') => {
    const query = `
        INSERT INTO media_status (media_id, status)
        VALUES ($1, $2)
        ON CONFLICT (media_id) 
        DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [media_id, status]);
    return rows[0];
};

module.exports = { MediaStatusPostService };
