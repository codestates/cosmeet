const dateUtil = (input_date) => {

  // k_date
    const date = new Date(input_date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate() 
    
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    
    // month - 0,1,2,3,4,5,6,7,8,9,10,11
 
    return {
        'year':year,
        'month':month,
        'day':day,
        'h':h,
        'm':m,
        's':s
    }
}

export default dateUtil