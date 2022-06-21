import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/common.css'
import '../style/header.css'


const Header = () => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(false)

    const onClickLogin = () => {
        let login = JSON.parse(sessionStorage.getItem('login'))

        if (login) {
            sessionStorage.removeItem('login')
            sessionStorage.removeItem('token')
            setIsLogin(false)
            alert('로그아웃')
            navigate('/')
        } else {
            navigate('/login')
        }
    }

    const onClickHome = () => {
        navigate('/')
    }

    const onClickWrite = () => {
        let login = sessionStorage.getItem('login')
      
    if(!login){
      alert('로그인 후 이용할 수 있습니다')
      navigate('/login')
      return;
    }
        navigate('/write')
    }
    return (
        <div className="wrapper">
            <div className="inner">
                <ul className="inner list header-list">
                    <li className="logo item header-item hover" onClick={onClickHome}>COSMEET</li>
                    <ul className="item headter-item debate-category-list">
                        <li className="debate-category-item hover drop-wrapper">토론 목록
                          <div className="drop-list">
                            <div cassName="drop-contents">
                                <div className="drop-item">프론트엔드 개발</div>
                                <div className="drop-item">백엔드 개발</div>
                                <div className="drop-item">프로덕트 매니지먼트</div>
                                <div className="drop-item">그로스 마케팅</div>
                                <div className="drop-item">인공지능(AI)</div>
                                <div className="drop-item">블록체인</div>
                                <div className="drop-item" style={{borderBottom:"1px solid rgb(128,128,128,0.2)"}}>데브옵스</div>
                                <div className="drop-item">빗썸 테크 아카데미(FE & BE) </div>



                            </div>
                          </div>
                        </li>
                        <li className="debate-category-item hover">참가 토론</li>
                        <li className="debate-category-item hover">
                        </li>


                    </ul>
                    <ul className="item header-item tools-list">
                        <div className="welcom-box">
                            {/* {isLogin ?
                            <div>
                        {sessionStorage.getItem('email') }
                                  님 안녕하세요</div> :""
                            
                            } */}

                        </div>
                        <li className="item tools-item button hover" onClick={onClickLogin}>
                            {(sessionStorage.getItem('login')) ? "로그아웃" : "로그인"}
                        </li>
                       
                    </ul>

                </ul>
            </div>
        </div>
    )
}

export default Header