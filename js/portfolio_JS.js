// =============================================
// Portfolio JS — Mirwais Sarwary
// Same plain style as the TTA portfolio script:
// commented steps, simple functions, no frameworks.
// Quiet Medtech intro gate added Sep 2026.
// =============================================

// These functions open and close the contact form
function openForm() {
    var form = document.getElementById("myForm");
    form.style.display = "block";
    form.classList.add("is-open");
}

function closeForm() {
    var form = document.getElementById("myForm");
    form.style.display = "none";
    form.classList.remove("is-open");
}

// This function displays the first image in the slideshow when the page loads
var slideIndex = 1;

// This function changes the slide when the left or right arrows are clicked
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// This function changes the slide when the dots are clicked
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var slides = document.getElementsByClassName("mySlides"); // This takes all elements with the class name "mySlides" and stores them in the variable array "slides"
    var dots = document.getElementsByClassName("dot"); // This takes all elements with the class name "dot" and stores them in the variable array "dots"
    if (!slides.length) { return; } // Safety: if slideshow is not on the page yet, stop
    if (n > slides.length) { slideIndex = 1; } // If n is greater than the length of the array "slides", the slideIndex is set to 1
    if (n < 1) { slideIndex = slides.length; } // If n is less than 1, the slideIndex is set to the length of the array "slides"
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; // This for loop takes each item in the array "slides" and sets the display to none
    }
    for (var j = 0; j < dots.length; j++) {
        dots[j].className = dots[j].className.replace(" active", ""); // This for loop takes each item in the array "dots" and removes "active"
    }
    slides[slideIndex - 1].style.display = "block"; // This displays the image in the slideshow
    if (dots.length) {
        dots[slideIndex - 1].className += " active"; // This adds the active styling to the dot associated with the image
    }
}

// This code will close the contact form when the user clicks off of it
document.addEventListener("click", function (event) {
    // If the click happens on the cancel button OR anywhere that is not the contact form
    // AND the click does not happen on any element with the contact class then call closeForm()
    if (event.target.matches(".cancel") || !event.target.closest(".form-popup") && !event.target.closest(".Pop_Up_Button") && !event.target.closest(".contact")) {
        closeForm();
    }
}, false);

// =============================================
// INTRO SPLASH — Search for candidate / Skip intro
// Uses brainstorm snapshot images for each stage.
// =============================================

// Holds timer IDs so Skip can cancel a running search animation
var introTimers = [];

// Helper: schedule a step and remember the timer so we can clear it
function introLater(fn, ms) {
    var id = setTimeout(fn, ms);
    introTimers.push(id);
    return id;
}

// Helper: cancel any pending intro steps
function clearIntroTimers() {
    for (var i = 0; i < introTimers.length; i++) {
        clearTimeout(introTimers[i]);
    }
    introTimers = [];
}

// Switch the full-screen snapshot background stage
function setIntroStage(stageName) {
    var bg = document.getElementById("Intro_Stage_Bg");
    if (!bg) { return; }
    bg.className = "Intro_Stage_Bg Intro_Stage_Bg--" + stageName;
}

// Types text into Intro_Status one character at a time (searching animation)
function typeIntroStatus(text, doneFn) {
    var status = document.getElementById("Intro_Status");
    if (!status) {
        if (doneFn) { doneFn(); }
        return;
    }
    status.classList.add("Intro_Status--Blink");
    status.textContent = "";
    var i = 0;
    function tick() {
        if (i <= text.length) {
            status.textContent = text.slice(0, i);
            i += 1;
            introLater(tick, 70);
        } else if (doneFn) {
            doneFn();
        }
    }
    tick();
}


// Shows the Quiet Medtech portfolio and hides the intro splash
function showPortfolio() {
    clearIntroTimers();

    var splash = document.getElementById("Intro_Splash");
    var main = document.getElementById("Portfolio_Main");

    // Reveal portfolio content
    if (main) {
        main.classList.remove("Portfolio_Main--Hidden");
    }

    // Allow page scrolling again
    document.body.classList.remove("Intro_Active");

    // Fade the splash out, then remove it from view
    if (splash) {
        splash.classList.add("Intro_Splash--Hide");
        introLater(function () {
            splash.style.display = "none";
        }, 500);
    }

    // Start the skills slideshow once the portfolio is visible
    showSlides(slideIndex);
}

// Skip intro: no animation — open the portfolio right away
function skipIntro(event) {
    if (event) {
        event.preventDefault();
    }
    showPortfolio();
}

// Search for candidate: play snapshot stages, then open portfolio
function startCandidateSearch() {
    var gate = document.getElementById("Intro_Gate");
    var status = document.getElementById("Intro_Status");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hide Search button; keep Skip during Searching
    var searchBtn = document.getElementById("Intro_Search_Button");
    if (searchBtn) {
        searchBtn.style.display = "none";
    }

    // Reduced motion: brief found, then portfolio
    if (reduceMotion) {
        setIntroStage("Found");
        if (status) {
            status.classList.remove("Intro_Status--Blink");
            status.textContent = ""; // found.jpg carries the label
        }
        introLater(showPortfolio, 900);
        return;
    }

    // Step 1: Searching snapshot + typed/flashing Searching...
    setIntroStage("Searching");
    typeIntroStatus("Searching...", function () {
        // Hold on Searching longer (Skip is always available before this starts)
        introLater(function () {
            // Soft flash cycle: clear and re-type once more for motion
            typeIntroStatus("Searching...", function () {
                introLater(function () {
                    // Step 2: Found
                    setIntroStage("Found");
                    if (status) {
                        status.classList.remove("Intro_Status--Blink");
                        status.textContent = ""; // found.jpg carries the label
                    }

                    // Step 3: Zoom / transition snapshot
                    introLater(function () {
                        setIntroStage("Zoom");
                        if (status) {
                            status.textContent = "";
                        }
                        // Step 4: open Quiet Medtech portfolio
                        introLater(showPortfolio, 1600);
                    }, 1600);
                }, 2200); // extra hold after second Searching type-out
            });
        }, 2800); // hold after first Searching type-out
    });
}

// Wire up the intro controls after the page HTML is ready
document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.getElementById("Intro_Search_Button");
    var skipLink = document.getElementById("Intro_Skip_Link");

    // Start on the gate snapshot
    setIntroStage("Gate");

    if (searchBtn) {
        searchBtn.addEventListener("click", startCandidateSearch);
    }
    if (skipLink) {
        skipLink.addEventListener("click", skipIntro);
    }

    // Slideshow starts inside showPortfolio() after Skip or Search completes.
});
