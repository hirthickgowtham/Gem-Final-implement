const pool = require('../../config/db.config'); // Import database pool



// Service to get gem types from the database
const getGems = async () =>{

    // SQL query to fetch gem types grouped by division
    const query = `
    SELECT
      division,
      json_agg(
        json_build_object(
          'gemId', gem_id,
          'gemName', gem_name,
          'image', general_gem_image
        )
      ) AS gems
    FROM gem_table
    GROUP BY division
    ORDER BY division ASC;
`;


    // Execute the query and return results
    const {rows} = await pool.query(query);


    return rows;
}


// Export service functions
module.exports = {
    getGems
}