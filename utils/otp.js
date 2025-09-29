const crypto = require('crypto');

function generateOtp(length=6){
     return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports={generateOtp,hashText} 