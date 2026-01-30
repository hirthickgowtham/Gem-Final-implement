const pool = require('../../../../config/db.config');


const UpdataEachGemDetailService = async (each_gem_id, payload) => {
    const allowedFields = [
        'lot_number',
        'gem_id',
        'crt',
        'number_of_gems',
        'description',
        'category',
        'color_id',
        'shape_id'
    ];

    const keys = Object.keys(payload).filter(k =>
        allowedFields.includes(k)
    );

    const setClause = keys
    .map((key, idx) => `${key} = $${idx + 1}`)
    .join(', ');

    const values = keys.map(k => payload[k]);
    values.push(each_gem_id);

    const query = `
    UPDATE each_gem_detail 
    SET ${setClause} 
    WHERE each_gem_id = $${keys.length + 1} RETURNING *;
  `;

  const {rows} = await pool.query(query, values);
  return rows[0];

}


module.exports = { UpdataEachGemDetailService };