import simpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import GalleryApiService from "./NewsApiService";
import LoadMoreBtn from "./components/loadMoreBtn";

const ref = {
  form: document.querySelector(".search-form"),
  gallery: document.querySelector(".gallery"),

}; 
 

const lightbox = new simpleLightbox('.gallery a');
const galleryApiService = new GalleryApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  isHidden: true,
});

ref.form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", fetchArticles);

function onSubmit(e) {
   e.preventDefault();
   
   galleryApiService.q = e.currentTarget.elements.searchQuery.value.trim();

   loadMoreBtn.show();
   galleryApiService.resetPage();
   clearList();
   fetchArticles();

}
function fetchArticles() {
    loadMoreBtn.disable();
    loadMoreBtn.show();

    return galleryApiService
      .getImages()
      .then(res => {
        notification(res);
     
       return res.hits
      })
      .then(appendGallery)
      .catch(OnError)
      .finally(() => {
        ref.form.reset();
        loadMoreBtn.enable();

      });
}
function appendGallery(markup) {
    let img = '';
    img = markup.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) =>
    { return `
    <a class="gallery-item" href="${largeImageURL}">
    <div class="photo-card">
  
    <img class="images" src="${webformatURL}" alt="${tags}" loading="lazy" width="280" height="180"/>
    
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
</div></a>`;
    }
    )
    .join('');


    ref.gallery.insertAdjacentHTML("beforeend", img);
    lightbox.refresh();
  }
  
  function clearList() {
    ref.gallery.innerHTML = "";
  }
function OnError(err) {
    console.log (err);
  
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadMoreBtn.hide();
}

function notification(res) {
  if (galleryApiService.page === 2)
Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
 if (res.hits.length < galleryApiService.perPage) {
  loadMoreBtn.hide();
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}  
}

