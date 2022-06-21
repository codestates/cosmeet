import React, { useEffect, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../style/write.css'
import { useNavigate } from "react-router-dom";
const Write = () => {
    const navigate = useNavigate()
    const [title,setTitle] = useState()

    const [inputTitle, setInputTitle] = useState()
    const [inputDesc, setInputDesc] = useState();
    

    const onChangeTitle = (e) => {
        setInputTitle(e.target.value)
    }

    const onChangeDesc = (data) => {
        setInputDesc(data)
    }

    const submit = () => {
        const data = JSON.parse(sessionStorage.getItem('debate') )
        const id = data._id

        const url = `http://ec2-13-125-84-174.ap-northeast-2.compute.amazonaws.com:8080/api/post/${id}`
        const accessToken = sessionStorage.getItem('token')
        const body = {
            title:inputTitle,
            contents:inputDesc
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization':`Bearer ${accessToken}`
            },
            body: JSON.stringify(body),
        }).then((res) => res.json() )
        .then(()=>{
          alert('글 작성')
          navigate('/board')
        })
        .catch(()=>{

          alert('알 수 없는 오류')
          navigate('/')
        })
    }
    useState(()=>{
        let data = JSON.parse(sessionStorage.getItem('debate'))
    setTitle(data.title)
    
    }, [])

    useEffect(()=>{
        let login = sessionStorage.getItem('login')
      
        if(!login){
          alert('로그인 후 이용할 수 있습니다')
        console.log('비회원')
          navigate('/login')
        }
    }, [])
    return(
<div className="wrapper">
    <div className="inner">
    <div className="write-wrapper">
        <h2>{title}</h2>
        <div className="title-box">
            <input className="input-title" placeholder="제목을 입력 하세요" onChange={onChangeTitle}/>
            
        </div>
        <CKEditor 
          editor={ClassicEditor}
          data=""
          config={{
            placeholder:`${title}에 대해 자유롭게 이야기 해주세요`,
            toolbar: ['bold', 'italic', 'link'],
          }}
          onReady={editor => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
              onChangeDesc(data)
            console.log({ event, editor, data });
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
        <div className="submit-box">
            <div className="cancle-btn">취소</div>
            <div className="submit-btn" onClick={submit}>작성하기</div>

        </div>
    </div>
    </div>
</div>
    )
}


export default Write