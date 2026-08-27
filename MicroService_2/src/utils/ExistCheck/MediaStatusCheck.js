const pool = require('../../config/db.config');

const MediaStatusCheck = async (media_id) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 FROM media_status WHERE media_id = $1
        ) AS exists;
    `;
    const { rows } = await pool.query(query, [media_id]);
    return rows[0]?.exists || false;
};

module.exports = { MediaStatusCheck };
