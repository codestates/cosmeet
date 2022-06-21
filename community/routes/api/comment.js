const express = require('express')
const router = express.Router();


const User = require('../../schema/user')
const Board = require('../../schema/board')
const Token = require('../../schema/token')
const JWT = require('../../utils/jwtUtil')
const Date = require('../../utils/dateUtil')

router.use('/', (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(404).send("not found token");
        return;
    } else {
        next();
    }
    console.log("test")
})

// 댓글 입력
router.post('/:id', function (req, res, next) {
    const { authorization } = req.headers
    const { comment } = req.body
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)
    const { id } = req.params

    if (!verifyToken.success || !comment) {
        res.status(404).send("토큰 만료일자 확인 및 댓글 입력 여부 확인");
        return;
    }
    if (!id) {
        res.status(404).send("check api docs");
        return;
    }

    const { email } = verifyToken
    User.findOne({ email: email }).then((userData) => {
        const name = userData.usr_name
        const nickname = userData.nickname

        Board.findOne({ _id: id }).then((boardData) => {
            let comments = boardData.comments
            if (!comments) {
                res.status(404).send();
                return;
            }

            if (comments.length === 0) {
                comments = [{
                    email: email,
                    usr_name: name,
                    nickname: nickname,
                    desc: comment,
                }]
            } else {
                comments = [...comments, {
                    email: email,
                    usr_name: name,
                    nickname: nickname,
                    desc: comment,
                }]
            }


            Board.findOneAndUpdate({ _id: id }, { comments: comments }, {
                new: true
            }).then((data) => {
                console.log(data, "여깅겨ㅣ@@")

            })
                .catch((err) => {
                    console.log(err)
                    res.status(200).send();
                    return;
                })
        })




    })

    res.status(200).send();
});

//댓글 삭제
router.delete('/:id/:cid', function (req, res, next) {
    const { id, cid } = req.params
    const { authorization } = req.headers

    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)


    if (!verifyToken.success) {
        res.status(404).send(verifyToken.message);
        return;
    }

    if (!id) {
        res.status(404).send("check api docs");
        return;
    }

    const { email,role } = verifyToken

    Board.findOne({_id:id})
    .then((targetPost) => {
        let checkAuthor = false;
        let filterTargetData = targetPost.comments.filter((el) => {
            if(el._id.toString() === cid){
                if(el.email === email){
                    checkAuthor = true
                }else{
                    if(role === "admin"){
                        checkAuthor = true
                    }else{
                        checkAuthor = false
                    }
                }
            }else{
                return el;
            }
        })

        if(!checkAuthor){
            res.status(404).send('');
            return;
        }

        Board.findOneAndUpdate({ _id: id }, { comments: filterTargetData }, {
            new: true
        })
        .then((data)=>{
          res.status(200).send('정상 삭제')
        })
        .catch((err) => {
                console.log(err)
                res.status(404).send();
                return;
            })
        
    })


})

module.exports = router;
