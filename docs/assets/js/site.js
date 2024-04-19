window.addEventListener('load', function() {
  const navToggle = document.querySelector("#navToggle");
  const navBar = document.querySelector("nav");
  navToggle.onclick = function() {
    navBar.classList.toggle('visible');
  }
});
