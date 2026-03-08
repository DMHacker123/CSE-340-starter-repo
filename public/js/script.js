// ****************************************
// CSE Motors Client Script
// ****************************************

// Display current year in footer
// Select elements
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#mainNav");

// Only run if the elements exist
if (menuButton && nav) {
  menuButton.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}