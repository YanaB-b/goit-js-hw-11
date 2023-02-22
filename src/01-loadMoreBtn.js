import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import GalleryApiService from "./NewsApiService";
import LoadMoreBtn from "./components/loadMoreBtn";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");


const lightbox = new SimpleLightbox('.gallery a')
const galleryApiService = new GalleryApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  isHidden: true,
});

form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", fetchArticles);

function onSubmit(e) {
   e.preventDefault();
   
   const form = e.currentTarget;
   const value = form.element.searchQuery.value.trim();

   galleryApiService.searchQueryPage = value;


   galleryApiService.resetPage();
   clearList();
   loadMoreBtn.show();
   fetchArticles();

}
function fetchArticles() {
    loadMoreBtn.disable();
    loadMoreBtn.show();

    return galleryApiService
      .fetchGallery()
      .then(res => {
       notification(res);
       return res.hits
      })
      .then(appendGallery)
      .catch(onError)
      .finally(() => {
        form.reset();
        loadMoreBtn.enable();

      });
}
function appendGallery(markup) {
    let img = '';
    img = markup.map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) =>
    { return `
    div class="img-card">
  <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="280" height="180"/>
    </a>
<div class="info">
  <p class="info-item"> <b>Likes</b>
    <span>${likes}</span>
  </p>
  <p class="info-item"><b>Views</b> 
    <span>${views}</span>
  </p>
  <p class="info-item">
    <b>Comments</b>
    <span>${comments}</span>
  </p>
  <p class="info-item">
    <b>Downloads</b>
    <span>${downloads}</span>
  </p>
</div>
</div>`;

    }
    ).join('');


    gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh
  }
  
  function clearList() {
    gallery.innerHTML = "";
  }
function onError(err) {
    console.log (err);
    loadMoreBtn.hide();
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}