const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

// 주의! 날짜 9시간 전임

const commentsSchema = new mongoose.Schema(
  [{
    id: ObjectId, 
    desc: String, 
    usr_email: String,
    nickname: String,
    user_id:{type: ObjectId, ref: 'User'},
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
    nickname:String,
    user_id:ObjectId,
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

  user_id:{type: ObjectId, ref: 'User'},
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