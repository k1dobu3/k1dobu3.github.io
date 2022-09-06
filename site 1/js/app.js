const body = document.body;
const btnMenu = document.querySelector('.header-menu');
var navigation = document.querySelector('.navigation')

btnMenu.addEventListener('click', function() {

    if (navigation.classList.contains('active-nav-aside')) {
        navigation.classList.remove('active-nav-aside');
        body.style.position = '';
    }
    else {
        navigation.classList.add('active-nav-aside');
        body.style.position = 'fixed';
    }


});