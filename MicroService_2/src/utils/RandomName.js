const  crypto = require('crypto');

const RandomName = (bytes=32) =>{
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {RandomName};