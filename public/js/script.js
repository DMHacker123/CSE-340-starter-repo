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

// ==============================
// Form Validation (Min 3 chars)
// ==============================

const inputs = document.querySelectorAll(".validate");

if (inputs.length > 0) {
  inputs.forEach(input => {

    input.addEventListener("blur", () => {
      input.dataset.touched = "true";
      validate(input);
    });

    input.addEventListener("input", () => {
      if (input.dataset.touched === "true") {
        validate(input);
      }
    });

  });
}

function validate(input) {
  if (input.value.length < 3) {
    input.classList.add("invalid");
    input.classList.remove("valid");
  } else {
    input.classList.add("valid");
    input.classList.remove("invalid");
  }
}