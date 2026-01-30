const gemservice = require('./GemTypeHandling.service'); // Import service


// Controller to get gem types
const getGemTypes = async (req,res) =>{

    try{

        // Call service to get gem types
        const gems = await gemservice.getGems();

        res.status(200).json({ gems });

    }catch(error){
        console.error('Error fetching gem types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


// Export controller functions
module.exports = { getGemTypes }