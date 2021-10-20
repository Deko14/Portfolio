window.addEventListener('scroll', e => {
    const el = document.getElementById('jsScroll');
    if(window.scrollY > 200) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
  
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}