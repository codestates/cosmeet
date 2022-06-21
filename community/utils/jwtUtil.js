// 로그인 시 db조회 후 리프레시 토큰 유무 확인

// case:1  있다면 엑세스 토큰 발급 후 로그인 허가
// case:2  없다면 리프레시 토큰 발급, db 기록 후 로그인 허가



// 요청 시

// case:1  헤더에 엑세스 토큰이 없음  40x 에러
// case:2  헤더에 엑세스 토큰이 있지만 해독불가 40x 에러
// case:3  헤더에 엑세스 토큰이 있지만 기간이 만료 -> db 조회 후 리프레시 토큰 기간 만료 시 로그인 끊기
// case:4  헤더에 엑세스 토큰이 있지만 기간이 만료 -> db 조회 후 리프레시 토큰 기간이 남아있다면 엑세스 토큰 재발급
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

module.exports = {
  sign: (email) => {
    const payload = {
      email: email,
      role: "user"
    };

    return jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  },
  sign_admin: (email) => {
    const payload = {
      email: email,
      role: "admin"
    };
    return jwt.sign(payload, secret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  },
  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        success: true,
        email: decoded.email,
        role: decoded.role
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  },

  refresh: () => { // refresh token 발급
    return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
      algorithm: 'HS256',
      expiresIn: '7d',
    });
  },

  refreshVerify: async (token, userId) => {

  },
};


