const burgerBtn = document.querySelector('.burger_menu')
const mainContent = document.querySelector('.main_content')
const sidebar = document.querySelector('.sidebar')
burgerBtn.addEventListener('click',()=>{
    mainContent.classList.toggle('active');
    sidebar.classList.toggle('active');
})

const searchIcon = document.querySelector('.input-group-prepend');
const searchForm = document.querySelector('.search_form');
const searchBar = document.querySelector('.search_bar');
searchIcon.addEventListener('click',()=>{
    if(searchBar.validity.valid){
        searchForm.submit();
    }

})
