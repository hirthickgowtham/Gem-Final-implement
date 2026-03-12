const pool = require('../../../../config/db.config');


const EachGemIdPostService = async (each_gem_id, mediaArray) => {
    const values = [];
    const placeholders = [];

    mediaArray.forEach((item, index) => {
        const baseIndex = index * 3;

        placeholders.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`
        );

        values.push(each_gem_id, item.media_type, item.media_file);
    });

    console.log(values,placeholders)

    const query = `
        INSERT INTO media_table (each_gem_id, media_type, media_file)
        VALUES ${placeholders.join(', ')}
        RETURNING media_id;
    `;

    const { rows } = await pool.query(query, values);
    return rows;
}

module.exports = {EachGemIdPostService};