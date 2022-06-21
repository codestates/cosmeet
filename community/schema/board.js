const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const commentsSchema = new mongoose.Schema(
  [{
    id: ObjectId, 
    email: String, 
    usr_name: String,
    nickname:String, 
    desc: String, 
    created_at: {type:Date,default:Date.now() }, 
    updated_at: {type:Date,default:Date.now() }, 
    deleted_at: {type:Date,default:null} 
  }]
);

const likeSchema = new mongoose.Schema(
  [{
    id: ObjectId,
    usr_name: String,
    email: String,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    deleted_at: { type: Date, default: null },
  }]
)

const tagSchema = new mongoose.Schema({
  id:ObjectId,
  tag_id:{type:ObjectId,default:null},
  created_at:{type:Date, default:Date.now()},
  updated_at:{type:Date, default:Date.now()},
  deleted_at:{type:Date, default:null},
  isDeleted:{type:Boolean, default:false},
})


const BoardSchema = new mongoose.Schema({
  id: ObjectId,
  thread_id:{type:ObjectId,default:null},
  title: String,
  user_email: String,
  user_nickname: String,
  view_count: { type: Number, default: 0 },
  desc: String,
  tag:{type:[tagSchema], default:null},
  comment_count: { type: Number, default: 0 },
  like: { type: [likeSchema], default: null },
  like_count: { type: Number, default: 0 },
  comments: { type: [commentsSchema], default: null },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default:  Date.now() },
  deleted_at: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },

});
module.exports = mongoose.model('Board', BoardSchema);