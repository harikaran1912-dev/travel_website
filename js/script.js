/* ============================================
   TravelGo - Main JavaScript
   1. Dark / Light mode
   2. Mobile menu
   3. Image slider
   4. Booking modal
   5. Form validation (login, contact, booking)
   ============================================ */

/* 1. DARK / LIGHT MODE ---------------------- */
const themeBtn = document.getElementById("themeToggle");

// Apply the saved theme when the page loads
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeBtn.textContent = next === "dark" ? "☀️" : "🌙";
  });
}

/* 2. MOBILE MENU ---------------------------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });

  // Close the menu after clicking a link
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
    });
  });
}

/* 3. IMAGE SLIDER --------------------------- */
const slidesBox = document.getElementById("slides");

if (slidesBox) {
  const totalSlides = slidesBox.children.length;
  const dotsBox = document.getElementById("dots");
  let currentSlide = 0;
  let autoSlide;

  // Create one dot for each slide
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () {
      showSlide(i);
      restartAuto();
    });
    dotsBox.appendChild(dot);
  }

  function showSlide(index) {
    // Loop around at the start and end
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    slidesBox.style.transform = "translateX(-" + currentSlide * 100 + "%)";

    const dots = dotsBox.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === currentSlide);
    }
  }

  function startAuto() {
    autoSlide = setInterval(function () {
      showSlide(currentSlide + 1);
    }, 4000);
  }

  function restartAuto() {
    clearInterval(autoSlide);
    startAuto();
  }

  document.getElementById("prevBtn").addEventListener("click", function () {
    showSlide(currentSlide - 1);
    restartAuto();
  });

  document.getElementById("nextBtn").addEventListener("click", function () {
    showSlide(currentSlide + 1);
    restartAuto();
  });

  showSlide(0);
  startAuto();
}

/* 4. BOOKING MODAL -------------------------- */
const modal = document.getElementById("bookingModal");
const destinationSelect = document.getElementById("bookDestination");

function openModal(destination) {
  if (!modal) return;
  modal.classList.add("open");
  // Pre-select the destination if a card button was clicked
  if (destination && destinationSelect) {
    destinationSelect.value = destination;
  }
}

function closeModal() {
  if (modal) modal.classList.remove("open");
}

// Every button with class "book-btn" opens the modal.
// The destination name comes from its data-destination attribute.
document.querySelectorAll(".book-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openModal(btn.dataset.destination);
  });
});

if (modal) {
  document.getElementById("closeModal").addEventListener("click", closeModal);

  // Close when clicking the dark area outside the box
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  // Close with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
}

/* 5. FORM VALIDATION ------------------------ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show an error message under a field ("" clears it)
function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

// ---- Booking form ----
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let ok = true;

    const name = document.getElementById("bookName").value.trim();
    const email = document.getElementById("bookEmail").value.trim();
    const date = document.getElementById("bookDate").value;
    const guests = document.getElementById("bookGuests").value;

    setError("bookNameError", "");
    setError("bookEmailError", "");
    setError("bookDateError", "");
    setError("bookGuestsError", "");

    if (name === "") { setError("bookNameError", "Please enter your name."); ok = false; }
    if (!isValidEmail(email)) { setError("bookEmailError", "Please enter a valid email."); ok = false; }
    if (date === "") { setError("bookDateError", "Please choose a travel date."); ok = false; }
    if (guests < 1) { setError("bookGuestsError", "At least 1 traveller is required."); ok = false; }

    if (ok) {
      document.getElementById("bookingSuccess").textContent =
        "Thank you, " + name + "! Your booking request has been received.";
      bookingForm.reset();
    }
  });
}

// ---- Login form ----
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let ok = true;

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    setError("loginEmailError", "");
    setError("loginPasswordError", "");

    if (!isValidEmail(email)) { setError("loginEmailError", "Please enter a valid email."); ok = false; }
    if (password.length < 6) { setError("loginPasswordError", "Password must be at least 6 characters."); ok = false; }

    if (ok) {
      document.getElementById("loginSuccess").textContent =
        "Login successful! (Demo only - no backend yet)";
      loginForm.reset();
    }
  });
}

// ---- Contact form ----
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let ok = true;

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    setError("contactNameError", "");
    setError("contactEmailError", "");
    setError("contactMessageError", "");

    if (name === "") { setError("contactNameError", "Please enter your name."); ok = false; }
    if (!isValidEmail(email)) { setError("contactEmailError", "Please enter a valid email."); ok = false; }
    if (message.length < 10) { setError("contactMessageError", "Message must be at least 10 characters."); ok = false; }

    if (ok) {
      document.getElementById("contactSuccess").textContent =
        "Thanks " + name + "! We have received your message.";
      contactForm.reset();
    }
  });
}
