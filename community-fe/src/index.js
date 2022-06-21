import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import Board from './pages/board'; // main ("/") 로 접근 시 Board 표시
import Login from './pages/login';
import BoardDetail from './pages/boardDetail';
import Write from './pages/write';
import Main from './pages/main';
import Header from './components/header';
import Signup from './pages/signup';
import MyPage from './pages/mypage'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<BrowserRouter>
  <Header />
<Routes>
  <Route path='/' element={<Main />}></Route>
  <Route path='/login' element={<Login />}></Route>
  <Route path='/board' element={<Board/>}></Route>
  <Route path='/write' element={<Write />}></Route>
  <Route path='signup' element={<Signup />}></Route>
  <Route path='/board/:id' element={<BoardDetail />}></Route>
  <Route path='/my' element={<MyPage />}></Route>
</Routes>

  </BrowserRouter>

);

