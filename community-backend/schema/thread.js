const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const debateSchema = new mongoose.Schema({
    id:ObjectId,
    board_id : {type:ObjectId, default:null}
})

const user = new mongoose.Schema({
  id: ObjectId,
  email: String,
})

const ThreadSchema = new mongoose.Schema({
  id: ObjectId,
  title: String,
  desc: String,
  admin_email: String,
  // admin_idx:ObjectId,
  type:String,
  activation:{type: Boolean, default: true},
  engaged_users:{type:[user],default: null},
  view_count:{ type: Number, default: 0},
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default:  Date.now() },
  deleted_at: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },
});
module.exports = mongoose.model('Thread', ThreadSchema);