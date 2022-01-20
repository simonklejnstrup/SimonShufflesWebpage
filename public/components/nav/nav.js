const homeLink = document.getElementById('nav-home');
const msgBoardLink = document.getElementById('nav-msgboard');

if (document.title === 'Messageboard') {
    console.log('messagdbored')
    msgBoardLink.classList.remove(...msgBoardLink.classList);
    msgBoardLink.classList.add('nav-item', 'active');
    homeLink.classList.remove(...homeLink.classList);
    homeLink.className = 'nav-item';
} else {
    msgBoardLink.classList.remove(...msgBoardLink.classList);
    msgBoardLink.className = 'nav-item';
    homeLink.classList.remove(...homeLink.classList);
    homeLink.classList.add('nav-item', 'active');   
}