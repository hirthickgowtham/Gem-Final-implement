const pool = require("../../../../config/db.config");

const AddThumbnailMediaService = async (each_gem_id, Url)=>{

    const query = `
  INSERT INTO thumbnail (each_gem_id, image)
  VALUES ($1, $2)
  RETURNING each_gem_id, image;
`;

    const value = [each_gem_id, Url];

    console.log(value);

    const {rows} = await pool.query(query,value);

    return rows[0];

}

module.exports = {
    AddThumbnailMediaService
};