const pool = require('../../../../config/db.config');


const GemDetailEditService = async (gem_id, payload) => {
    const allowedFields = [
        'gem_name',
        'division'
    ];

    const keys = Object.keys(payload).filter(k =>
        allowedFields.includes(k)
    );

    const setClause = keys
    .map((key, idx) => `${key} = $${idx + 1}`)
    .join(', ');

    const values = keys.map(k => payload[k]);
    values.push(gem_id);

    const query = `
    UPDATE gem_table 
    SET ${setClause} 
    WHERE gem_id = $${keys.length + 1} RETURNING *;
  `;

  const {rows} = await pool.query(query, values);

  return rows[0];


}

module.exports = { GemDetailEditService };