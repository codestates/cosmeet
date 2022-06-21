const express = require('express')
const router = express.Router();

const User = require('../../schema/user')
const Board = require('../../schema/board')
const Token = require('../../schema/token')
const Tag = require('../../schema/tag')


const JWT = require('../../utils/jwtUtil')
const Date = require('../../utils/dateUtil')

// router.use('/', (req, res, next) => {
//     if (!req.headers.authorization) {
//         res.status(404).send("not found token");
//         return;
//     } else {
//         next();
//     }
//     console.log("test")
// })

router.post('/', (req, res, next) => {
    const { tag_name, desc } = req.body
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)

    if (!verifyToken.success) {
        res.status(404).send(verifyToken.message)
        return;
    }

    console.log(verifyToken.email)

    Tag.findOne({ tag_name: tag_name }).then((data) => {
        if (data === null) {
            Tag.insertMany([{
                tag_name: tag_name,
                desc: desc,
                creator_id:verifyToken.email
            }]).then((data) => {
                    console.log(data)
                    res.status(200).send(data)
                    return;
                })
        } else {
            res.status(404).send()
            return;
        }
    })



})

// 태그 삭제
router.delete('/:name', (req, res, next) => {
    const {name} = req.params
    console.log(name)
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)

    if (!verifyToken.success) {
        res.status(404).send(verifyToken.message)
        return;
    }

   Tag.findOne({tag_name:name,isDeleted:false}).then((data)=>{
      if(data === null){
        res.status(404).send("존재하지 않는 태그")
        return;
      }else{
        Tag.findOneAndUpdate({tag_name:name},{isDeleted:true},{
            new:true
           }).then((data)=>{
            console.log(data)
            res.status(200).send(data)
           })
      }
   })
   console.log("test")

})

router.post('/:name', (req,res,next) => {
  const {name,desc} = req.body

    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)

    if (!verifyToken.success) {
        res.status(404).send(verifyToken.message)
        return;
    }

    const {email} = verifyToken
  Tag.create({
    tag_name:name,
    desc:desc,
    creator_id:email
  })
})



module.exports = router;
