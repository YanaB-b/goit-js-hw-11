import axios from "axios";
import Notiflix from "notiflix";

const URL = 'https://pixabay.com/api/';
const KEY = '33827578-bf8f715bed7d1235235f0071a';

const options = {
    params: {
        key: KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,

    },
};
export default class GalleryApiService{
    constructor() {
        this.page = 1;
        this.q = '';
        this.perPage = options.params.per_page;

    }
   async getImages() {
    try {
        const response = await axios.get(
            `${URL}?q=${this.q}&page=${this.page}`,
            options
        );
        console.log(response.data);

        if (!response.data.totalHits) {
            throw new Error(response.status);
        }
    this.nextPage();
        return response.data;

    } catch (error) {
       return error; 
    }
}
    nextPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }

    
}
