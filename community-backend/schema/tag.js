const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;



const TagSchema = new mongoose.Schema(
  [{
    id: ObjectId, 
    tag_name:String,
    desc: String, 
    isDeleted:{type:Boolean,default:false},
    creator_id:{type:String,default:null},
    created_at: {type:Date,default:Date.now() }, 
    updated_at: {type:Date,default:Date.now() }, 
    deleted_at: {type:Date,default:null} 
  }]
);


module.exports = mongoose.model('Tags', TagSchema);
