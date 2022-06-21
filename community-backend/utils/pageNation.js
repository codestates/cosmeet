module.exports = {
    paging :(page, totalPost, maxPost) => {
        // 페이지에 나오는 최대 게시물 수
        const max = 10
        
        // 페이지에 나오는 최대 페이지 수
        const maxPage = maxPost
        
        // 받아오는 page가 스트링일경우 Number형으로 변경하고, 아닐경우 1로 입력
        let currentPage = page ? parseInt(page) : 1
        
        // 표시할 게시물이 없을 경우 남은 페이지는 1, 
        // 게시물이 뒤에 있을경우 page -1 를 하고 maxPost값을 곱한다 
        const hidePost = page === 1 ? 0 : (page - 1) * maxPost
        
        // 페이징처리해야하는 페이지 수 
        // Math.ceil은 나머지값이 있으면 올림처리한다.
        const totalPage = Math.ceil(totalPost / maxPost)
        
        // url로 직접 접근하는 경우, 
        // currentPage가 totalPage보다 클 경우 currentPage를 마지막 페이지로 바꿔준다
        if (currentPage > totalPage) {
          currentPage = totalPage
        }
        
        // 화면에 표시할 페이지의 시작 번호를 구한다.
        // Math.floor 소수점 이하를 제거
        // (현재 페이지 번호 -1 / 최대 페이지 번호) * 최대 페이지 번호 + 1 = 시작 페이지 번호 
        const startPage = Math.floor(((currentPage - 1) / maxPage)) * maxPage + 1
        
        // 화면에 표시할 페이지의 마지막 번호를 구한다.
        // 페이지 시작 번호 + 최대 페이지 번호 - 1
        let endPage = startPage + maxPage - 1
        
        // endPage 필요이상을 늘어나는것을 방지
        // maxPage === 10, totalPage === 25, statePage === 21 경우
        // endPage가 30 되면 정보가 없는 칸이 늘어나기 때문에 방지
        if (endPage > totalPage) {
          endPage = totalPage
        }
        
        return { startPage, endPage, hidePost, max, totalPage, currentPage }

  }
}
