import  crypto from 'crypto';

const RandomName = (bytes=32) =>{
    return crypto.randomBytes(bytes).toString('hex');
}

export default RandomName;