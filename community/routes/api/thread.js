const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');


const User = require('../../schema/user')
const Board = require('../../schema/board')
const Thread = require('../../schema/thread')
const Page = require('../../utils/pageNation')
const Token = require('../../schema/token')
const JWT = require('../../utils/jwtUtil')
const Date = require('../../utils/dateUtil')




// get all thread
router.get('/', async (req, res, next) => {
    const page = Number(req.query.page);
    const totalPost = await Board.countDocuments({ isDeleted: false, activation: true })
    const { startPage, endPage, hidePost, max, totalPage, currentPage } = Page.paging(page, totalPost, 10)

    if (totalPost <= 10 && page >= 2) {
        Thread.find({ isDeleted: false, activation: true })
            .sort({ _id: -1 })
            .then((data) => {
                res.status(404).send();
                return;
            })
    } else {
        Thread.find({ isDeleted: false, activation: true })
            .sort({ _id: -1 })
            .skip(hidePost)
            .limit(max)
            .then((data) => {
                res.status(200).send(data)
                return;
            })
    }
    // res.status(200).send("모든 토론");
})

// get best thread
router.get('/best', (req, res, next) => {
    Thread.find({ isDeleted: false })
        .sort({ view_count: -1 })
        .limit(4)
        .then((data) => {
            console.log(data)
            res.status(200).send(data)
            return;
        })
})

// get new thread
router.get('/new', (req, res, next) => {
    Thread.find({ isDeleted: false })
        .sort({ _id: -1 })
        .limit(4)
        .then((data) => {
            console.log(data)
            res.status(200).send(data)
            return;
        })
})

// get target thread
router.get('/:id', (req, res, next) => {
    const { id } = req.params
    
    Thread.findOne({ _id: id }).then((data) => {
        if (!data) {
            res.status(404).send('삭제된 게시물')
            return;
        }
        let view_count = data.view_count + 1
        Thread.findOneAndUpdate({"_id":id},{"view_count":view_count},{
            upsert:false
        })
        .then((update_data) => {
          res.status(200).send(updata_data)
          return;
        })
        if (data.isDeleted) {
            res.status(404).send('삭제된 게시물')
            return;
        }
    })
})





// 포스팅
// 토론 참여
router.post('/join/:id', (req, res, next) => {
    const { id } = req.params
    // const { authorization } = req.headers
    // const token = authorization.split(' ')[1]
    // const verifyToken = JWT.verify(token)
    // const { email, role } = verifyToken

    Thread.findOne({ _id: id }).then((data) => {
        if (!engaged_users) {
            res.status(404).send();
            return;
        } else {
            let engaged_users = data.engaged_users
            engaged_users.push({ email: email })

            for (let i = 0; i <= engaged_users.length - 1; i++) {
                if (engaged_users[i].email === email) {
                    res.status(404).send("이미 참여한 토론");
                    return;
                }
            }
            Thread.findOneAndUpdate({ _id: id }, { engaged_users: engaged_users }, {
                new: true
            }).then((result) => {
                res.status(200).send(result)
            })
        }
    })
})



// 아래부터 권한 체크
router.use('/', (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)
    const { email, role } = verifyToken

    if (!verifyToken.success) {
        res.status(404).send(verifyToken.message);
        return;
    }
    if (verifyToken.role !== "admin") {
        console.log(verifyToken)
        res.status(404).send("check your role");
        return;
    }
    if (!verifyToken.email) {
        res.status(404).send("check your email in token")
    }
    // 
    next()

})

// 토론 개설
router.post('/add', (req, res, next) => {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)
    const { email, role } = verifyToken

    const { title, desc } = req.body
    if (!title || !desc) {
        res.status(404).send('title, desc 파라미터 체크');
        return;
    }
    const admin_email = "admin"

    Thread.insertMany({
        title: title,
        desc: desc,
        admin_email: email
    })
        .then((data) => {
            res.status(200).send(data)
            return;
        })
        .catch((err) => {
            console.log(err)
            res.status(404).send(err)
            return;
        })
})

// 토론 활성화
router.post('/enable/:id', (req, res, next) => {

    const { id } = req.params
    // const { authorization } = req.headers
    // const token = authorization.split(' ')[1]
    // const verifyToken = JWT.verify(token)
    // const { email, role } = verifyToken

    const email = "admin"  // 임시 데이터
    const role = "admin"



    Thread.findOneAndUpdate({ _id: id }, { activation: false }, {
        new: true
    }).then((result) => {
        console.log(result)
        if (email !== result.admin_email || role !== "admin") {
            res.status(404).send('권한이 없습니다')
            return;
        }
    }).catch((err) => {
        console.log(err)
        res.status(404).send();
        return;
    })

    res.status(200).send("토론 활성화")
})

// 토론 비활성화
router.post('/disable/:id', (req, res, next) => {
    // const { id } = req.params

    // const { authorization } = req.headers
    // const token = authorization.split(' ')[1]
    // const verifyToken = JWT.verify(token)
    // const { email, role } = verifyToken


    const email = "admin"  // 임시 데이터
    const role = "admin"



    Thread.findOneAndUpdate({ _id: id }, { activation: false }, {
        new: true
    }).then((result) => {
        console.log(result)
        if (email !== result.admin_email) {
            res.status(404).send('권한이 없습니다')
            return;
        }
    }).catch((err) => {
        console.log(err)
        res.status(404).send();
        return;
    })

    res.status(200).send("비활성화")
})

module.exports = router;