import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/common.css'
import '../style/login.css'



const Login = () => {
    const [value_id, setValue_id] = useState("")
    const [value_pw, setValue_pw] = useState("")
    const navigate = useNavigate();

    const url = "http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/login"

    const onChangeId = (e) => {
        setValue_id(e.target.value)
    }

    const onChangePw = (e) => {
        setValue_pw(e.target.value)
    }


    const onClickLogin = () => {
        // if (value_id.length <= 2) {
        //     alert('아이디를 3글자 이상 입력 해주세요')
        // }

        // if (value_pw.length <= 6) {
        //     alert('비밀번호를 올바르게 입력 해주세요')
        // }
        
        const body = {
            email:value_id,
            password:value_pw
        }

        const bodySample = {   // 가입 사용자 샘플 데이터
            "email":"test01@example.com",
            "password":"1234"
        }

        const bodySample02 = {   // 미가입 사용자 샘플 데이터
            "email":"aaaaaaa2301@example.com",
            "password":"1234"
        }

        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        }).then( async (res) => {
          console.log(res)
          const token = res.headers.get('authorization');
          const getOnlyToken = token.split(' ')[1]
          sessionStorage.setItem('token',getOnlyToken) 
          
          let body = await res.json()
          sessionStorage.setItem('login',true)
          sessionStorage.setItem('email',value_id)
          sessionStorage.setItem('nickname',body.nickname)
          // navigate('/')
          window.location.replace('/')

        })

        

    }

    const onClickSignup = () => {
        navigate('/signup')
    }

  



    return (
        <div className="wrapper">
      <div className="inner">
      <div class="template-wrapper">
      <div class="form-container">
        <div>
            <h3>로그인</h3>
            <p>비밀번호를 잊지 않도록 주의 하세요</p>
          <div class="form-group">
            <input type="text" class="form-control" required onChange={onChangeId}/>
            <span>이메일</span>
            <span class="border"></span>
          </div>
          
          <div class="form-group">
            <input class="form-control" required type="password" onChange={onChangePw}/>
            <span>비밀번호</span>
            <span class="border"></span>
          </div>
          <div className="btn-login hover" onClick={onClickLogin}>로그인</div>
          <div className="btn-signup hover" onClick={onClickSignup}>회원 가입</div>
        </div>
      </div>
    </div>

      </div>
    </div>
    
    )
}


export default Login