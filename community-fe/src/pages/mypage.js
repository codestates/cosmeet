import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/my.css'


const MyPage = () => {
    const [nick, setNick] = useState()
    const [pw, setPw] = useState();
    const [nickValid, setNickValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const navigate = useNavigate();


    const onChangeNickName = (e) => {
      setNick(e.target.value)
    }

    const onChangePw = (e) => {
        setPw(e.target.value)
    }

    const onClickNickSubmit = (e) => {
      if(!nickValid){
        alert('닉네임 중복체크를 해주세요')
        return;
      }

      const body = {nickname:nick}
      const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/nickname`
      const accessToken = sessionStorage.getItem('token')
      fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'authorization':`Bearer ${accessToken}`
        },
        body: JSON.stringify(body),
    }).then((res) => {
        if(res.status === 200){
            alert('변경 되었습니다')
            setNickValid(true)
            navigate('/')
          }else{
            alert('사용 불가능한 닉네임')
            setNickValid(true)
          }
        // res.json()
    })
    }


    const onClickPwSubmit = (e) => {
      const body = {password:pw}
      const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/password`
      const accessToken = sessionStorage.getItem('token')
      fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'authorization':`Bearer ${accessToken}`
        },
        body: JSON.stringify(body),
    }).then((res) => {
        if(res.status === 200){
            alert('변경 되었습니다')
            setNickValid(true)
            navigate('/')
          }else{
            alert('알 수 없는 에러')
            setNickValid(true)
          }
        // res.json()
    })
      
    }

    const validCheck = () =>{
        const body = {nickname:nick}
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/nickname`
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        }).then((res) => {
            if(res.status === 200){
                alert('사용 가능한 닉네임')
                setNickValid(true)
              }else{
                alert('사용 불가능한 닉네임')
                setNickValid(true)
              }
            // res.json()
        })
    }


    useEffect(()=>{
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/my`
        const accessToken = sessionStorage.getItem('token')
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization':`Bearer ${accessToken}`
            },
        }).then((res) => res.json() )
        .then(()=>{

          navigate('/my')
        })
        .catch(()=>{

          alert('알 수 없는 오류')
          navigate('/')
        })
    }, [])

    return (
<div className="wrapper">
      <div className="inner">
      <div class="template-wrapper">
      <div class="form-container">
        <div>

          <h4>마이페이지</h4>
          <div class="form-group">
            <input type="text" class="form-control" required onChange={onChangeNickName}/>
            <span>현재 닉네임: {sessionStorage.getItem('nickname')}</span>

            
            <span class="border"></span>
<div className='valid-btn hover' onClick={validCheck}>중복체크</div>
<div className="btn-change hover" onClick={onClickNickSubmit}>닉네임 변경하기</div>


            
          </div>
          <div class="form-group">
            <input class="form-control" required onChange={onChangePw}/>
            <span>비밀번호</span>
            <span class="border"></span>
          </div>
          <div className="btn-change hover" onClick={onClickPwSubmit}>비밀번호 변경하기</div>
        </div>
      </div>
    </div>

      </div>
    </div>
    )
}


export default MyPage
