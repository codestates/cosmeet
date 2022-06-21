const express = require('express');
const router = express.Router();



const Board = require('../../schema/board')
const User = require('../../schema/user')



const post = require('./post')
const comment = require('./comment')
const like = require('./like')
const tag = require('./tag')
const thread = require('./thread')

router.use('/post', post)
router.use('/comment', comment)
router.use('/like', like)
router.use('/tag', tag)
router.use('/thread', thread)







router.use('/', function (req, res, next) {
  // 토큰 검증 로직 후 에러처리 or Next 처리
  console.log("test")
  next()
})

// 친구의 포스팅
router.get('/main', function (req, res, next) {
  User.findOne({ email: email })
    .then((userData) => {
      const ids = userData.friends_idx
      Board.find({ '_id': { $in: ids } })
        .then((boardData) => {
          res.status(200).send(boardData)
        })
        .catch(() => {
          res.status(404).send()
        })
    });
});

// 친구가 아닌 유저의 포스팅
router.get('/feed', function (req, res, next) {
  const { authorization } = req.headers
  const token = authorization.split(' ')[1]
  const verifyToken = JWT.verify(token)
  const { email } = verifyToken
  if (!verifyToken.success) {
    res.status(404).send(verifyToken.message)
    return;
  }

  User.findOne({ email: email })
    .then((userData) => {
      const ids = userData.friends_idx
      Board.find({ '_id': { $in: !ids } })
        .then((boardData) => {
          res.status(200).send(boardData)
        })
        .catch(() => {
          res.status(404).send()
        })
    })
});

router.get('/mypage', function (req, res, next) {
  const { authorization } = req.headers
  const token = authorization.split(' ')[1]
  const verifyToken = JWT.verify(token)
  const { email } = verifyToken
  if (!verifyToken.success) {
    res.status(404).send(verifyToken.message)
    return;
  }

  User.findOne({ email: email })
    .then((data) => {
      res.status(200).send({ data })
      return;
    }).catch((err) => {
      res.status(404).send("")
      return;
    })

});





module.exports = router;