const pool = require('../../../../config/db.config');

const MediaFileDeleteService = async (media_ids) => {

    const query = `
        DELETE FROM media_table
        WHERE media_id = ANY($1::int[])
        RETURNING media_id;
    `;

    const {rows} = await pool.query(query,[media_ids]);

    return rows;
}

module.exports = {
    MediaFileDeleteService
};