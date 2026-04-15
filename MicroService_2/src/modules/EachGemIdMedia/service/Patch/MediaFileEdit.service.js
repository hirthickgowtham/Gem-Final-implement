const pool = require('../../../../config/db.config');

const MediaFileEditService = async (mediaList) => {

    if (!Array.isArray(mediaList) || mediaList.length === 0) {
        throw new Error("mediaList cannot be empty");
    }

    const values = [];
    const placeholders = [];

    mediaList.forEach((item, index) => {
        const base = index * 2;

        if (!item.media_id || isNaN(item.media_id)) {
            throw new Error("Invalid media_id");
        }

        placeholders.push(`($${base + 1}, $${base + 2})`);
        values.push(parseInt(item.media_id), item.media_file);
    });

    const query = `
        UPDATE media_table AS m
        SET media_file = v.media_file
        FROM (
            VALUES ${placeholders.join(', ')}
        ) AS v(media_id, media_file)
        WHERE m.media_id = v.media_id::int
        RETURNING m.media_id, m.media_file;
    `;

    const { rows } = await pool.query(query, values);

    return rows;
};

module.exports = {
    MediaFileEditService
};