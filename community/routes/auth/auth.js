const express = require('express');
const router = express.Router();
const SHA256 = require('crypto-js/sha256')

const User = require('../../schema/user')
const Board = require('../../schema/board')
const Token = require('../../schema/token')

const JWT = require('../../utils/jwtUtil')
const Date = require('../../utils/dateUtil')

// 로그인
router.post('/login', async (req, res, next) => {
    const {email,password} = req.body
    const cryptoPassword = SHA256(password).toString()

    

    let findUser = await User.findOne({email:email,password:cryptoPassword})



    if(findUser){
      if(findUser.role === "admin"){
        const accessToken = JWT.sign_admin(email)
        res.header("Access-Control-Expose-Headers", "authorization");
        res.status(200).header({'authorization':"Bearer " + accessToken}).json({"test":"test"});

      }else{
        const accessToken = JWT.sign(email)
        res.header("Access-Control-Expose-Headers", "authorization");
        res.status(200).header({'authorization':"Bearer " + accessToken}).json({"test":"test"});
        return;
      }
     
    }else{
        res.status(404).send("아이디 비밀번호를 다시 확인해주세요");
        return;
    }

});


// 이메일 중복 체크
router.post('/email', async (req, res, next) => {
    const {email} = req.body
    if(!email){
        res.status(404).send("request body check");
        return;
    }

    let userInfo = await User.findOne({"email":email}).catch((err)=>{
        console.log(err) 
        return; })
    
    if(userInfo){
      res.status(404).send('가입된 이메일')
      return;
    }else{
      res.status(200).send('사용 가능한 이메일'); 
      return;  
    }
});



// 회원 가입
router.post('/join', async (req, res, next) => {
    const {name,email,nickname,password,role} = req.body
    if(!name || !email || !nickname || !password){
        res.status(404).send();
        return;
    }

    let userCheck = await User.findOne({"email":email}) // find로 하면 배열 값이 나옴 findOne 으로 해야 null or data
    if(userCheck){
        console.log(userCheck,"this")
        const emailCheck = userCheck.email
        const nicknamCheck = userCheck.nickname
        if(email === emailCheck || nickname === nicknameCheck){
            res.status(404).send("가입된 이메일");
            return;
        }
        
    }

    const accessToken = JWT.sign(email)
    const refreshToken = JWT.refresh()
    const cryptoPassword = SHA256(password).toString()

    let createInfo = await User.insertMany([{ 
        email:email,
        nickname:nickname,
        password:cryptoPassword,
        name:name,
    }] )

    let createToken = await Token.insertMany([{
        user_email:email,
        created_date:Date.now(),
        expired_date:Date.refreshTokenDate(),
        token_value:refreshToken
    }])

    res.status(200).header({'authorization':"Bearer " + accessToken}).send('회원 가입');
});

router.patch('/nickname', (req,res,next) => {
  const { nickname } = req.body
  const { authorization } = req.headers
  const token = authorization.split(' ')[1]
  const verifyToken = JWT.verify(token)
  const { email, role } = verifyToken

  User.findOneAndUpdate({email:email},{
    nickname:nickname,
  },{
    new:true
  }).then( ( user_data)=>{
    res.status(200).send(user_data)
    return;
  })
  res.status(200).send('체인지')
})

router.patch('/password', (req,res,next) => {
    const { password } = req.body
    const cryptoPassword = SHA256(password).toString()
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)
    const { email, role } = verifyToken
  
    User.findOneAndUpdate({email:email},{
      password:cryptoPassword
    },{
      new:true
    }).then( ( user_data)=>{
      res.status(200).send(user_data)
      return;
    })
    res.status(200).send('체인지')
  })

router.patch('/addr', (req,res,next) => {
    const { addr } = req.body
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)
    const { email, role } = verifyToken
  
    User.findOneAndUpdate({email:email},{
      usr_addr:addr
    },{
      new:true
    }).then( ( user_data)=>{
      res.status(200).send(user_data)
      return;
    })
    res.status(200).send('체인지')
  })

// 토큰 재발급 요청
router.get('/', async (req,res) => {
    console.log("test")
    // 토큰 재발급 요청 클라이언트 측에서 n분 마다 재발급 요청 ex) 50분 마다
    const {authorization} = req.headers

    const token = authorization.split(' ')[1]
    const verifyToken = JWT.verify(token)  // 콘솔 찍어보면 성공, 실패, 이유
    
    if(verifyToken.success){
        // let refreshCheck = await Token.findOne().where({"user_email":verifyToken.email})
        // console.log(refreshCheck)
        const accessToken = JWT.sign(verifyToken.email)
        res.header("Access-Control-Expose-Headers", "authorization");
        res.status(200).header({"authorization":"Bearer " + accessToken}).send("success")
        return;
    }else{
        res.status(404).send("false")
        return;
    }
  })



module.exports = router;