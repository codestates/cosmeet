const express = require('express')
const router = express.Router();
const JWT = require('../../utils/jwtUtil')

const User = require('../../schema/user')
const Board = require('../../schema/board')
const Token = require('../../schema/token')
const Thread = require('../../schema/thread')
const Page = require('../../utils/pageNation')
const DateUtil = require('../../utils/dateUtil')


// 서버요청 요구사항 여부 검증
// router.use('/', (req, res, next) => {
//     if (!req.headers.authorization) {
//         res.status(404).send("not found token");
//         return;
//     } else {
//         next();
//     }
//     console.log("test")
// })

//모든 게시물 조회
router.get('/', async (req, res, next) => {
    const page = Number(req.query.page);
    const thread = req.query.thread
    const totalPost = await Board.countDocuments({ isDeleted: false })
    const { hidePost, max } = Page.paging(page, totalPost, 10)

    if (totalPost <= 10 && page >= 2) {
        Board.find({ isDeleted: false })
            .sort({ _id: -1 })
            .then((data) => {
                res.status(404).send();
                return;
            })
    } else {
        Board.find({ isDeleted: false, thread_id: thread })
            .sort({ _id: -1 })
            .skip(hidePost)
            .limit(max)
            .then((data) => {
                Thread.findOne({ _id: thread }).then((thread_data) => { // 조회수 
                    if (!thread_data) {
                        res.status(404).send('삭제된 게시물')
                        return;
                    }
                    let view_count = thread_data.view_count + 1
                    Thread.findOneAndUpdate({ "_id": thread }, { "view_count": view_count }, {
                        upsert: false
                    })
                        .then(() => {
                            res.status(200).send(data)
                            return;
                        })
                })

            })
    }
})

router.get('/join', (req,res,next) => {
  
  res.status(200).send('토론 참여 여부')
})


router.get('/my', (req, res, next) => {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)
    const { email } = verifyToken

    if (!verifyToken.success) {
        res.status(404).send();
        return;
    }

    Board.find({ user_email: email })
        .then((data) => {
            res.status(200).send(data)
        })
        .catch((err) => {
            console.log(err)
            res.status(404).send(err)
        })
})
// 게시글 조회
router.get('/:id', (req, res, next) => {
    console.log("test")
    const { id } = req.params
    // 도큐먼트 ObjectId


    Board.findOne({ _id: id }).then((data) => {
        console.log(data)
        if (!data) {
            res.status(404).send('삭제된 게시물')
            return;
        }
        let view_count = data.view_count + 1
        if (data.isDeleted) {
            res.status(404).send('삭제된 게시물')
            return;
        }

        Board.findOneAndUpdate({ _id: id }, { view_count: view_count }, {

        }).then((result) => {
            res.status(200).send(result);

        }).catch((err) => {
            console.log(err)
            res.status(404).send();
            return;
        })
    }).catch((err) => {
        console.log(err)
        res.status(404).send();
        return;
    })

});



// 게시물 작성
router.post('/:thread', (req, res, next) => {
    const { thread } = req.params
    console.log(thread, "스레드")
    console.log(DateUtil.now())

    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)

    const { title, contents } = req.body

    // 토큰 검증 여부
    if (!verifyToken.success) {
        res.status(404).send();
        return;
    }

    const { email } = verifyToken

    User.findOne({
        email: email
    }).then((result) => {
        const { nickname } = result
        Board.create({
            title: title,
            user_email: email,
            user_nickname: nickname,
            desc: contents,
            thread_id: thread
        })
            .then((board_data) => {
                res.status(200).send(board_data)
            })
    }).catch((err) => {
        console.log(err)
        res.status(404).send();
        return;
    })

});

// 내 게시물 수정
router.patch('/:id', async (req, res, next) => {
    const { authorization } = req.headers
    const { id } = req.params
    const { title, desc } = req.body

    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)

    if (!verifyToken.success) {
        res.status(404).send();
        return;
    }

    if (!id || !title || !desc) {
        res.status(404).send("check api docs");
        return;
    }


    const { email } = verifyToken.email
    // 도큐먼트 ObjectId
    await Board.findOneAndUpdate({ _id: id, email: email }, { title: title, desc: desc }, {
        new: true
    }).catch((err) => {
        console.log(err)
        res.status(404).send();
        return;
    })

    res.status(200).send('글 수정');
});

// 게시물 삭제
router.delete('/:id', async (req, res, next) => {
    const { authorization } = req.headers
    const { id } = req.params

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

    const { email, role } = verifyToken

    Board.findOne({ _id: id })
        .then((targetPost) => {
            if (targetPost.user_email === email || role === "admin") {
                Board.findOneAndUpdate({ _id: id }, { isDeleted: true }, {
                    new: true
                }).then((result) => {
                    res.status(200).send("success")
                })
                    .catch((err) => {
                        console.log(err)
                        res.status(404).send();
                        return;
                    })
            } else {
                res.status(404).send('권한이 없습니다')
                return;
            }
        })


});



module.exports = router;


