import axios from "axios";
import Notiflix from "notiflix";

const URL = 'https://pixabay.com/api/';
const KEY = '33827578-bf8f715bed7d1235235f0071a';

const options = {
    parametry: {
        key: KEY,
        image_type:'photo',
        orientation:'horizontal',
        safesearch:'true',
        page_per: 40,

    },
}
export default class GalleryApiService{
    constructor(){
        this.page = 1;
        this.searchQueryPage = '';
        this.perPage = options.parametry.page_per;

    }
   async getImages(){
    try {
        const endpoint = await axios.get(
            `${URL}?q=${this.searchQuery}7&page=${this.page}`,
            options
        );
        
    } catch (error) {
       return error 
    }
}
    nextPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }

    
}
