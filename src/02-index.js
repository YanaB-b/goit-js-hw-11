import simpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import GalleryApiService from "./NewsApiService";



const ref = {
    form: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
    guard: document.querySelector('.guard'),
  
  };
   
  const lightbox = new simpleLightbox('.gallery a');
  const galleryApiService = new GalleryApiService();

  ref.form.addEventListener("submit", onSubmit);

  function onSubmit(e) {
    e.preventDefault();
    
   galleryApiService.q = e.currentTarget.elements.searchQuery.value.trim();
 

    galleryApiService.resetPage();
    clearList();
    fetchArticles();
 
 }
 function fetchArticles() {
 
     return galleryApiService
       .getImages()
       .then(res => {
        observer.observe(ref.guard);
        notification(res);
        return res.hits;
       })
       .then(appendGallery)
       .catch(onError)
       .finally(() => {
         ref.form.reset();
        
 
       });
 }

 function appendGallery(markup) {
    let img = '';
    img = markup.map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) =>
    { return `<a class="gallery-item" href="${largeImageURL}">
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
    ).join('');


    ref.gallery.insertAdjacentHTML("beforeend", img);
    lightbox.refresh();
  }

  function clearList() {
    ref.gallery.innerHTML = "";
  }
function onError(err) {
    console.log (err);
    observer.unobserve(ref.guard);
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}
function notification(res) {
  if (galleryApiService.page === 2)
Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
else if (res.hits.length < galleryApiService.perPage) {
  observer.unobserve(ref.guard);
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
} 
}
const scroll = {
root: null,
rootMargin: '300px',

};
const observer = new IntersectionObserver(onScroll , scroll);

function onScroll(enteries) {
    console.log(enteries);
    enteries.forEach(entry => {
        console.log(entry.isIntersecting);
        if (entry.isIntersecting) {
            fetchArticles()
        }
    });
}
