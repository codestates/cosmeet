const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema; 


const TokenSchema = new mongoose.Schema({
  id:ObjectId,
  user_email:String,
  token_value:String,
  created_at:{type:Date, default:Date.now()},
  updated_at:{type:Date, default:Date.now()},
  deleted_at:{type:Date, default:null},
  isDeleted:{type:Boolean, default:false},
});
module.exports = mongoose.model('Token', TokenSchema);