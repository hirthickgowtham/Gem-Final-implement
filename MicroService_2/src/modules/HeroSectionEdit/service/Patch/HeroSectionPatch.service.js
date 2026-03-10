const pool = require("../../../../config/db.config");

const HeroSectionPatchService = async (payload) =>{

    const allowedFields = [
        'title',
        'description'
    ];

    const keys = Object.keys(payload).filter(k =>
        allowedFields.includes(k)
    );

    const setClause = keys
    .map((key, idx) => `${key} = $${idx + 1}`)
    .join(', ');

    const values = keys.map(k => payload[k]);
    values.push(payload.HeroId);

    const query = `
    UPDATE hero_section 
    SET ${setClause} 
    WHERE id = $${keys.length + 1} RETURNING *;
  `;

  const {rows} = await pool.query(query, values);

  return rows[0];

}

module.exports = {
    HeroSectionPatchService
};