const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIE_PER_PAGE = 12

const movies = []
//儲存符合篩選條件的項目
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

//新增電影pannel
function renderMovieList(data){
  //dataPanel = 
  let rawHTML = ''
  
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src= ${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title 
text-truncate ">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
      `
  })

  dataPanel.innerHTML = rawHTML
}

//電影內容
function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescripiton = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response =>{
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText ='Release date:' + data.release_date
    modalDescripiton.innerText = data.description
    modalImage.innerHTML = `<img src = "${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

//加入最愛
function addToFavorite(id){
    //將字串轉成物件
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    
  //尋找電影ID是否符合
  const movie = movies.find(movie => movie.id === id)
  if(list.some(movie => movie.id === id)){
    return alert('you already add this movie')
  }
  
  //放入電影清單
  list.push(movie)
  //將物件轉成字串並存入
localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

//新增頁面pannel
function renderPaginator(amount){
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = ''

  for(let page = 1 ; page <= numberOfPages ; page++){
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

//分頁
function getMoviesByPage(page){
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page-1) * MOVIE_PER_PAGE
  return data.slice(startIndex , startIndex + MOVIE_PER_PAGE)
}

//按鈕點擊事件
dataPanel.addEventListener('click', function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))    
  } else if (event.target.matches('.btn-add-favorite')){    
    addToFavorite(Number(event.target.dataset.id))
    console.log(event.target.dataset.id)
  }
})

//搜尋點擊事件
searchForm.addEventListener('submit',function onSearchFormSubmitted(event){
  //取消預設事件
  // event.preventDefault()

  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  
  //錯誤處理：輸入無效字串
  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {
  return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  // 重新輸出至畫面
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))

})

//分頁點擊事件
paginator.addEventListener('click',function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  
  renderMovieList(getMoviesByPage(page))
})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))