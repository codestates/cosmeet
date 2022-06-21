module.exports ={
    now:() =>{
        const date = new Date();
        date.setHours(date.getHours() + 9)
        return date
    },
    utc:() => {
        const date = new Date();
        return date
    },
    accessTokenDate:()=>{
        const date = new Date();
        date.setHours(date.getHours() + 10) // 현재시간 + 9, 토큰 유효기간 + 1
    },
    refreshTokenDate:()=>{
        const date = new Date();
        date.setHours(date.getHours() + 9)
        date.setDate(date.getDate() + 7);
    }
}