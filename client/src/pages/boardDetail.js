import React, { useCallback, useEffect, useRef, useState } from "react";
import useDidMountEffect from "../hooks/useDidMountEffect";
import { useNavigate } from "react-router-dom";
import dateUtil from "../utils/dateUtil";
import '../style/boardDetail.css'
import '../style/common.css'


const BoardDetail = () => {
    const url = "http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/post"
    const comment_url = 'http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/comment'
    const board_del_url = "http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/post"
    const like_count_Ref = useRef()


    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState();
    const [data, setData] = useState();
    const [comments, setComments] = useState();
    const [likeState, setLikeState] = useState(false)
    const [likeCountValue, setLikeCountValue] = useState(0)
    const commentInput = useRef(null)
    const [test, setTest] = useState(0);

    const [comment_value, setComment_value] = useState()


    const onClickDelete = () => {
        if (!window.confirm("정말 삭제 하시겠습니까?")) {
            return;
        }

        const localData = JSON.parse(sessionStorage.getItem('target'))
        const target_id = localData._id
        const accessToken = sessionStorage.getItem('token')

        fetch(board_del_url + '/' + target_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
        }).then((res) => {
            console.log(res.status)
            if (res.status === 200) {
                alert('정삭적으로 삭제 되었습니다')
                navigate('/')
                return;
            } else {
                alert('권한이 없습니다')
                navigate('/')
                return;
            }
        }).catch(() => {
            alert('아이디, 비밀번호를 확인 해주세요')
        })
    }


    const onClickCommentDelete = (e) => {
        if(!window.confirm("정말 삭제 하시겠습니까?")){
            alert('취소 하셨습니다')
            return;
        }
        let data = e.target.getAttribute("cid")
        data = Number(data)
        data = comments[data]._id

        const cid = data

        const localData = JSON.parse(sessionStorage.getItem('target'))
        const id = localData._id
        const accessToken = sessionStorage.getItem('token')

        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/comment/${id}/${cid}`
        



        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
        }).then((res) => {
            console.log(res.status)
            if (res.status === 200) {
                alert('정상적으로 삭제 되었습니다')
                navigate('/')
                return;
            } else {
                alert('권한이 없습니다')
                navigate('/')
                return;
            }
        }).catch(() => {
            alert('아이디, 비밀번호를 확인 해주세요')
        })
    }




    const onChangeCommentValue = (e) => {
        setComment_value(e.target.value)
    }
    const onClickCommentSubmit = () => {
        const localData = JSON.parse(sessionStorage.getItem('target'))
        const target_id = localData._id
        const accessToken = sessionStorage.getItem('token')

        const body = {
            comment: comment_value
        }

        fetch(comment_url + '/' + target_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body),
        }).then(() => {
            window.location.reload();

        })

    }
    const focusInput = () => {
        // 로그인 여부 검증 후 댓글 입력 제어
        console.log("focus")

        if (!sessionStorage.getItem('token')) {
            navigate('/login')
        } else {
            return;
        }
    }

    const onClickLikeBtn = () => {
        if (likeState) {
            setLikeCountValue(likeCountValue - 1)
        } else {
            setLikeCountValue(likeCountValue + 1)

        }
        setLikeState(!likeState)
        const data = JSON.parse(sessionStorage.getItem('target'))
        const id = data._id
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/like/${id}`
        const accessToken = sessionStorage.getItem('token')

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
        })
            .then((res) => res.json())
            .then(() => {

            })
            .catch(() => {
                alert('세션 만료')
                navigate('/login')
            }, [])

    }

    // mount
    useEffect(() => {
        if (!sessionStorage.getItem('target')) {
            alert('잘못된 접근')
            navigate('/')
            return;
        }
        const localData = JSON.parse(sessionStorage.getItem('target'))
        const target_id = localData._id
        const accessToken = sessionStorage.getItem('token')

        // setData(localData)
        // console.log(localData.comments)


        fetch(url + '/' + target_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${accessToken}`
            },
        }).then(async (res) => {
            const data = await res.json()
            const email = sessionStorage.getItem('email')
            setLikeCountValue(data.like_count)

            for (let i = 0; i <= data.like.length - 1; i++) {
                if (data.like[i].email === email) {
                    setLikeState(true)
                }
            }

            if (res.status === 200) {
                let fix = data
                for (let i = 0; i <= fix.comments.length - 1; i++) {
                    let fix_date = dateUtil(fix.comments[i].created_at, "k")
                    fix.comments[i].created_at = `${fix_date.year}-${fix_date.month}-${fix_date.day}  ${fix_date.h}:${fix_date.m}:${fix_date.s}`
                }

                let fix_date = dateUtil(fix.created_at, "k")
                fix.created_at = `${fix_date.year}-${fix_date.month}-${fix_date.day}  ${fix_date.h}:${fix_date.m}:${fix_date.s}`
                setData(fix)
                setComments(fix.comments)
                setIsLoading(true)
            }
        })
        // .catch(() => {
        //     sessionStorage.removeItem('target')
        //     alert('잘못된 접근')
        //     navigate('/')
        //     return;
        // })


        //unmount 
        return () => {
            sessionStorage.removeItem('target')
        }
    }, [])

    // useEffect(()=>{

    // }, [comments])



    useEffect(() => {
        setTest(1)
    }, []);





    //     useEffect(() => {
    // console.log('data')
    //         if (data) {
    //             CommentMaker();
    //         }
    //     }, [data])
    return (
        <div className="wrapper">
            <div className="inner">
                <div className="board-detail-box">
                    <div className="board-detail-box-inner">
                        <div className="board-detail-section">
                            <div className="board-detail-section-delete-btn hover" onClick={onClickDelete}>삭제</div>
                            <h1>
                                {data ? data.title : "로딩중"}
                            </h1>
                            <div className="profile-box">
                                <div>
                                <img className="img-detail" width="20" height="auto" src={require("../icon/account.png")} />
                                </div>
                                <div className="bold">
                                    {data ? data.user_nickname : "로딩중"}

                                </div>
                            </div>
                            <div className="detail-info">
                                <div className="detail-item">
                                    <img className="img-detail" width="16" height="auto" src={require("../icon/icon_like_off.png")} />

                                    {data ? <span> {likeCountValue} </span> :<span>알 수 없음</span>}
                                </div>
                                <div className="detail-item">
                                <img className="img-detail" width="16" height="auto" src={require("../icon/view.png")} />

                                    {data ? data.view_count : "알 수 없음"}
                                </div>
                                <div className="detail-item">
                                <img className="img-detail" width="16" height="auto" src={require("../icon/time.png")} />
                                    {data ? data.created_at : "얼마 전"}
                                </div>
                            </div>
                        </div>

                        <div className="desc-section">
                            {data ? <div dangerouslySetInnerHTML={{ __html: data.desc }}></div> : "로딩중"}

                        </div>
                        {likeState ?
                            <div onClick={onClickLikeBtn}>
                                <img className="icon-like" src={require("../icon/icon_like_on.png")} />
                            </div>
                            :
                            <div onClick={onClickLikeBtn}>
                                <img className="icon-like" src={require("../icon/icon_like_off.png")} />
                            </div>
                        }

                        <div className="comment-section">
                            <div>
                                <h4>댓글</h4>
                                <div className="comment-input-box">
                                    <textarea className="comment-input" placeholder={sessionStorage.getItem.login ? "댓글을 입력 해주세요" : "로그인 후 댓글을 입력 해주세요"} ref={commentInput} onChange={onChangeCommentValue} onFocus={focusInput} />
                                    <div className="comment-input-submit hover" onClick={onClickCommentSubmit} >댓글 입력</div>
                                </div>
                                {isLoading === true ?
                                    data.comments.map((item, idx) => {
                                        const nickcname = item.nickname
                                        const date = item.created_at
                                        const desc = item.desc
                                        const example = "국회는 정부의 동의없이 정부가 제출한 지출예산 각항의 금액을 증가하거나 새 비목을 설치할 수 없다. 국가는 대외무역을 육성하며, 이를 규제·조정할 수 있다."
                                        return (
                                            <div className="comment-box" key={idx} cid={idx}>
                                                <div className="comment-delete-btn hover" cid={idx} onClick={onClickCommentDelete}>삭제</div>
                                                <div className="comment-profile-box" cid={idx}>
                                                    <div>
                                <img className="img-detail" width="20" height="auto" src={require("../icon/account.png")} />

                                                    </div>
                                                    <div className="bold" cid={idx}>{nickcname ? nickcname : "알 수 없는 사용자"}</div>
                                                </div>
                                                <div cid={idx}>
                                                    <div cid={idx}>{desc ? desc : example}</div>
                                                </div>
                                                <div className="comment-detail-info-box" cid={idx}>
                                                    {date}
                                                </div>
                                            </div>
                                        )
                                    }) : ""}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}


export default BoardDetail