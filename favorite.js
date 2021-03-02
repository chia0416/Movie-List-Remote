const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//新增電影清單
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
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
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

//移除電影
function removeFromFavoite(id){
  //尋找電影ID是否符合
  const movieIndex= movies.findIndex(movie => movie.id === id)
  movies.splice(movieIndex,1)
  //將物件轉成字串並存入
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClicked(event){
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))    
  } else if (event.target.matches('.btn-remove-favorite')){    
    removeFromFavoite(Number(event.target.dataset.id))
    console.log(event.target.dataset.id)
  }
})

renderMovieList(movies)
