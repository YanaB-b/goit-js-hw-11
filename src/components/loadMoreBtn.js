export default class LoadMoreBtn{
    constructor ({selector,isHidden}){
        this.button = this.getButton(selector);
        if(isHidden) this.hide();
        else this.show();
    }
getButton(selector) {
    return document.querySelector(selector);
}
hide() {
    this.button.classList.add('hidden');
}
show() {
    this.button.classList.remove('hidden');
}
disable() {
    this.button.disable = true;
    this.button.textContent = 'Loadind...';
}
enable() {
    this.button.disable = false;
    this.button.textContent = 'Load more';

}
}