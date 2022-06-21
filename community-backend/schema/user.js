const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema; 


const friendsSchema = new mongoose.Schema({
  id:ObjectId,
  friends_id:{type:ObjectId,default:null},
  created_at:{type:Date, default:Date.now()},
  updated_at:{type:Date, default:Date.now()},
  deleted_at:{type:Date, default:null},
  isDeleted:{type:Boolean, default:false},
})

const friends_idxSchema = new mongoose.Schema(
  {
    id:ObjectId,
    friends_id:{type:ObjectId,default:null}
  }
)

const userSchema = new mongoose.Schema({
  id:ObjectId,
  usr_addr:{ type:String,default:null },
  nickname:{ type:String },
  isBanned:{type:Boolean,default:false},
  role:{type:String, default:"user"},
  friends_idx:{type:[friendsSchema], default: null},
  email: String,
  password: String,
  name: String,
  created_at:{type:Date, default:Date.now()},
  updated_at:{type:Date, default:Date.now()},
  deleted_at:{type:Date, default:null},
  isDeleted:{type:Boolean, default:false},
});
module.exports = mongoose.model('User', userSchema);