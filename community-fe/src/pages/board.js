import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dateUtil from '../utils/dateUtil'
import '../style/board.css'
import '../style/common.css'


const Board = () => {
    const [list, setList] = useState([])
    const [title, setTitle] = useState()
    const navigate = useNavigate()
    let page = sessionStorage.getItem('page')

    const getBoardDate = () => {
        let data = JSON.parse(sessionStorage.getItem('debate'))
        let page = JSON.parse(sessionStorage.getItem('page'))
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/post?page=${page}&thread=${data._id}`
        setTitle(data.title)

        fetch(url, () => {

        }).then(async (response) => {
            const data = await response.json()

            for (let i = 0; i <= data.length - 1; i++) {
                let fix_date = dateUtil(data[i].created_at, "k")
                data[i].created_at = `${fix_date.year}-${fix_date.month}-${fix_date.day}  ${fix_date.h}:${fix_date.m}:${fix_date.s}`

            }
            setList(data)
        })
    }

    const moreList = () => {
        let temp = Number(JSON.parse(sessionStorage.getItem('page'))) + 1
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/post?page=${temp}`


        fetch(url, () => {

        }).then(async (response) => {
            if (response.status === 404) {
                alert("더 이상 글이 없어요!")
                return;
            }
            let data = await response.json()
            if (data.length !== 0) {
                sessionStorage.setItem("page", temp)
                setList([...list, ...data])
            } else {
                alert("더 이상 글이 없어요!")

            }
        })
    }


    const clickListTarget = (e) => {
        let data = e.target.getAttribute("id")
        sessionStorage.setItem("target", JSON.stringify(list[data]))

        navigate(`/board/${list[data]._id}`)
    }

    const onClickWrite = (e) => {
        let login = sessionStorage.getItem('login')

        if (!login) {
            alert('로그인 후 이용할 수 있습니다')
            navigate('/login')
            return;
        }
        navigate('/write')
    }

    useEffect(() => {
        sessionStorage.setItem("page", 1)
        getBoardDate()

        return () => {
        }
    }, [])
    return (
        <div className="wrapper">
            <div className="inner">
                <ul className="board-list">
                    <h4 className="info-comment">최신순 입니다</h4>

                    <h1>{title ? title : "알 수 없는 토론"}</h1>
                    {list.length <= 0 ? "" :
                        <div className="board-write-btn-box">
                            <div className="board-write-btn hover" onClick={onClickWrite}>
                                나도 글 쓰기</div></div>}

                    {list.length <= 0 ?
                        <div className="blank_page_box">

                            <div>아무것도 없어요</div>
                            첫번째 게시물을 작성 해보세요!
                            <div className="hover write-btn" onClick={onClickWrite}>글 쓰러가기</div>
                        </div> : ""}

                    {list.map((item, idx) => {
                        let desc = `<div id=${idx}>${item.desc}</div>`
                        return (

                            <li className="board-item hover" key={idx} id={idx} onClick={clickListTarget}>
                                <div className="click-wrapper" id={idx} onClick={clickListTarget}> </div>
                                <div id={idx}>{item.key}</div>
                                <div className="board-item-title" id={idx}>{item.title}</div>
                                {/* <div className="board-item-email" id={idx}>{item.user_email}</div> */}
                                <div className="board-item-nickname" id={idx}>{item.user_id.nickname}</div>
                                <div className="board-item-desc" id={idx} dangerouslySetInnerHTML={{ __html: desc }}></div>
                                <div className="board-item-bottom-box">
                                    <div className="board-item-count" id={idx}>좋아요: {item.like_count}</div>
                                    <div className="board-item-count" id={idx}>조회수: {item.view_count}</div>
                                    <div className="board-item-date" id={idx}>{item.created_at}</div>
                                </div>
                            </li>


                        )

                    })}
                    {list.length <= 0 ?

                        "" :
                        <div className="more-btn-box">
                            <div className="more-btn hover" onClick={moreList}>더보기</div>
                        </div>}
                </ul>
            </div>
        </div>
    )
}


export default Board