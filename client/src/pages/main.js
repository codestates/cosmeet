import React, { useEffect, useState } from "react";
import dateUtil from "../utils/dateUtil";
import { useNavigate } from "react-router-dom";
import '../style/main.css'
import '../style/common.css'
import Board from "./board";


const Main = () => {
    const [list, setList] = useState([])
    const [newList, setNewList] = useState([])
    const navigate = useNavigate()
    let page = sessionStorage.getItem('page')

    const getBestBoardData = () => {
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/thread/best`

        fetch(url, () => {
        }).then(async (response) => {
            const data = await response.json()
            for(let i=0; i<=data.length-1; i++){
                let fix_date = dateUtil(data[i].created_at,"k")
                data[i].created_at = `${fix_date.year}-${fix_date.month}-${fix_date.day}  ${fix_date.h}:${fix_date.m}:${fix_date.s}`
            }
            setList(data)
        })
    }

    const getNewBoardData = () => {
        const url_new = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/thread/new`


        fetch(url_new, () => {
        }).then(async (response) => {
            const data = await response.json()

            for(let i=0; i<=data.length-1; i++){
                let fix_date = dateUtil(data[i].created_at,"k")
                data[i].created_at = `${fix_date.year}-${fix_date.month}-${fix_date.day}  ${fix_date.h}:${fix_date.m}:${fix_date.s}`
            }
            setNewList(data)
      getBestBoardData()

        })
    }

        
    
    const onClickDebate = (e) => {
        let id = e.target.getAttribute("id")
        // let localData = sessionStorage.getItem(debate)
        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/thread/${list[id]._id}`

        sessionStorage.setItem("debate", JSON.stringify(list[id]))
        navigate('/board')
    }


    useEffect(()=>{
      getNewBoardData()
      sessionStorage.removeItem('debate')

    }, [])




    return (
        <div className="wrapper">
            <div className="inner">
            <div className="banner-wrapper">
                    <div className="banner"></div>
                </div>
                <ul className="main-list">
                    <li className="main-item">
                        <div className="btn-debate-all">모든 토론 
                          <img className="img-detail" width="20" height="auto" src={require("../icon/more.png")} />
                        </div>
                        <div className="new-dabate-text-box">
                        <img className="img-new"  src={require("../icon/new.png")} />

                            최근 토론
                            </div>
                        <div className="debate-wrapper">

                            <ul className="debate-list">
                                {newList.map((item,idx)=>{
                                    return(
                                        <li key={idx} id={idx} className="debate-item hover" onClick={onClickDebate}>
                                            <div className="debate-title" id={idx}>{item.title}</div>
                                            <div className="debate-desc" id={idx}>{item.desc}</div>
                                        </li>
                                    )
                                })}
                                <div className="hover">AD</div>
                            </ul>
                        </div>
                    </li>
                    <li className="main-item">
                    <div className="new-dabate-text-box">
                        <img className="img-best"  src={require("../icon/hot.png")} />

                            베스트 토론
                            </div>
                        <div className="debate-wrapper">
                            <ul className="debate-list">
                            {list.map((item,idx)=>{
                                    return(
                                        <li key={idx} id={idx} className="debate-item hover" onClick={onClickDebate}>
                                            <div className="debate-title" id={idx}>{item.title}</div>
                                            <div className="debate-desc" id={idx}>{item.desc}</div>

                                            
                                        </li>
                                    )
                                })}
                                <div className="hover">AD</div>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}


export default Main