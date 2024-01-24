const mongoose = require('mongoose');
const validateMongodbId = (id)=>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error('This Id is not valid');

};

module.exports = validateMongodbId;