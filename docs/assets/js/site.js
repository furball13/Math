window.onload = function() {
  const hamburgerBtn = document.querySelector("#navToggle");
  const navBar = document.querySelector("nav");
  hamburgerBtn.onclick = function() {
    navBar.classList.toggle('visible');
  }
}
