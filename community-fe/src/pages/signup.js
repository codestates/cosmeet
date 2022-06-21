import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import '../style/common.css'
import '../style/signup.css'
const Signup = () => {
  const navigate = useNavigate()
  const [name,setName] = useState()
  const [id, setId] = useState()
  const [pw, setPw] = useState()
  const [nickname, setNickName] = useState();
  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onChangeId = (e) => {
    setId(e.target.value)
  }

  const onChangePw = (e) => {
    setPw(e.target.value)

  }
  const onChangeNickName = (e) => {
    setNickName(e.target.value)
  }

  const onClickNicnameValidCheck =  () => {
    const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/email`
    const body = {
      email:id
    }
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
  }).then((res) => {
      if(res.status === 200){
        alert('사용 가능한 이메일')
        return;
      }else{
        alert('이미 가입된 이메일 이거나 사용 불가능한 이메일 입니다')
      }
  }).catch((err)=>{
    console.log(err)
    alert('알 수 없는 에러')
  })
  }

  const onClickSubmit = () => {
  const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/auth/join`

    const body = {
      "name":name,
      "email":id,
      "nickname":nickname,
      "password":pw
  }
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
  }).then((res) => {
    alert('회원 가입이 완료 되었습니다.')
      navigate('/')
  }).catch(()=>{
    alert('아이디, 비밀번호를 확인 해주세요')
  })
  }
  return (
    <div className="wrapper">
      <div className="inner">
      <div class="template-wrapper">
      <div class="form-container">
        <form>
          <h4>회원 가입</h4>
          <p>양식에 맞추어 회원 정보를 입력해주세요.</p>
          <div class="form-group">
            <input type="text" class="form-control" required onChange={onChangeName}/>
            <span>이름</span>
            <span class="border"></span>
          </div>
          <div class="form-group">
            <input type="text" class="form-control" required onChange={onChangeNickName}/>
            <span>닉네임</span>
            <span class="border"></span>
            
          </div>
          <div class="form-group">
            <input type="text" class="form-control" required onChange={onChangeId} />
            <span>E-mail</span>
            <span class="border"></span>
            <div class="valid-check hover" onClick={onClickNicnameValidCheck}>중복 체크</div>
          </div>
          <div class="form-group">
            <input class="form-control" required onChange={onChangePw}/>
            <span>비밀번호</span>
            <span class="border"></span>
          </div>
          <div className="btn-signup hover" onClick={onClickSubmit}>회원 가입</div>
        </form>
      </div>
    </div>

      </div>
    </div>
    
  )
}


export default Signup


