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
    // Keep form open when clicking Contact / Send a message / other openForm triggers
    var isOpener = event.target.closest(".form-popup") ||
        event.target.closest(".Pop_Up_Button") ||
        event.target.closest(".contact") ||
        (event.target.closest("button") && event.target.closest("button").getAttribute("onclick") &&
            event.target.closest("button").getAttribute("onclick").indexOf("openForm") !== -1);
    if (event.target.matches(".cancel")) {
        closeForm();
    } else if (!isOpener) {
        closeForm();
    }
}, false);

// =============================================
// INTRO SPLASH — Earth mp4 gate + Search play-through
// Gate: paused gate-earth.mp4 behind real Search/Skip; plays once on Search.
// Search: play once (~11–12s) with flashing Searching...
// Then: Candidate found → zoom.jpg + Mirwais Sarwary found → portfolio.
// Skip: instant portfolio; cancel timers; stop video.
// prefers-reduced-motion: no video; short status → portfolio.
// =============================================

// Holds timer IDs so Skip can cancel a running search animation
var introTimers = [];

// True once Search has started (or Skip opened the portfolio)
var introSearchStarted = false;
var introFinished = false;

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

// Set Intro_Status text and optional flash / blink classes
function setIntroStatus(text, flash) {
    var status = document.getElementById("Intro_Status");
    if (!status) { return; }
    status.classList.remove("Intro_Status--Blink");
    status.classList.remove("Intro_Status--Flash");
    status.textContent = text || "";
    if (flash) {
        status.classList.add("Intro_Status--Flash");
    }
}

// Stop and hide the Earth gate video (used by Skip / showPortfolio)
function stopGateVideo() {
    var video = document.getElementById("Intro_Gate_Video");
    if (!video) { return; }
    try {
        video.pause();
        video.onended = null;
        video.loop = false;
        video.currentTime = 0;
    } catch (err) {
        // Some browsers throw if currentTime is set before metadata loads
    }
    video.style.display = "none";
}

// Idle gate: show Earth video paused on first frame behind Search / Skip
// (plays only after Search for candidate is clicked)
function showPausedGateVideo() {
    var video = document.getElementById("Intro_Gate_Video");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!video || reduceMotion) {
        if (video) {
            video.style.display = "none";
        }
        return;
    }
    video.loop = false;
    video.muted = true;
    video.style.display = "";
    try {
        video.pause();
        video.currentTime = 0;
    } catch (err) {
        // Metadata may not be ready yet; poster still shows
    }
    // Ensure first frame paints once metadata is available
    function seekToStart() {
        try {
            video.pause();
            video.currentTime = 0;
        } catch (err2) { /* ignore */ }
    }
    if (video.readyState >= 1) {
        seekToStart();
    } else {
        video.addEventListener("loadedmetadata", seekToStart, { once: true });
    }
}

// After the Search play-through ends:
// Candidate found → Mirwais Sarwary (name only) → Frame 3 transition (3s) → portfolio
function afterSearchVideoEnds() {
    if (introFinished) { return; }
    introFinished = true;
    clearIntroTimers();

    var video = document.getElementById("Intro_Gate_Video");
    if (video) {
        video.onended = null;
        try {
            video.pause();
        } catch (err) { /* ignore */ }
        video.style.display = "none";
    }

    // Step 1: Candidate found (clean dark stage; status is HTML text)
    setIntroStage("Gate");
    setIntroStatus("Candidate found", false);

    // Step 2: name only
    introLater(function () {
        setIntroStatus("Mirwais Sarwary", false);

        // Step 3: Frame 3 storyboard screen, hold 3 seconds, then portfolio
        introLater(function () {
            setIntroStatus("", false);
            setIntroStage("Transition");
            introLater(showPortfolio, 3000);
        }, 1500);
    }, 1200);
}

// Shows the portfolio and hides the intro splash
function showPortfolio() {
    clearIntroTimers();
    introFinished = true;
    stopGateVideo();

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
        // Use a one-shot timer that is not tracked (intro is done)
        setTimeout(function () {
            splash.style.display = "none";
        }, 500);
    }

    // Start the skills slideshow once the portfolio is visible
    showSlides(slideIndex);
}

// Skip intro: instant portfolio; cancel timers; stop video
function skipIntro(event) {
    if (event) {
        event.preventDefault();
    }
    clearIntroTimers();
    introFinished = true;
    stopGateVideo();
    showPortfolio();
}

// Search for candidate: play Earth video once with flashing Searching...
function startCandidateSearch() {
    if (introSearchStarted || introFinished) { return; }
    introSearchStarted = true;

    var status = document.getElementById("Intro_Status");
    var video = document.getElementById("Intro_Gate_Video");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hide Search button; keep Skip available during Searching
    var searchBtn = document.getElementById("Intro_Search_Button");
    if (searchBtn) {
        searchBtn.style.display = "none";
    }

    // prefers-reduced-motion: no video; short Candidate found → name → portfolio
    if (reduceMotion) {
        if (video) {
            video.style.display = "none";
        }
        setIntroStage("Gate");
        setIntroStatus("Candidate found", false);
        introLater(function () {
            setIntroStatus("Mirwais Sarwary", false);
            introLater(function () {
                setIntroStatus("", false);
                setIntroStage("Transition");
                introLater(showPortfolio, 3000);
            }, 1500);
        }, 900);
        return;
    }

    // Motion path: play Earth video once from the start; flash Searching...
    // Stay on Gate stage so the video (not searching.jpg) remains the backdrop
    setIntroStage("Gate");
    setIntroStatus("Searching...", true);

    if (!video) {
        // No video element — fall through with a short delay
        introLater(afterSearchVideoEnds, 1200);
        return;
    }

    video.style.display = "";
    video.loop = false;
    video.muted = true;
    video.onended = function () {
        afterSearchVideoEnds();
    };

    try {
        video.currentTime = 0;
    } catch (err) {
        // Ignore if metadata is not ready yet
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
            // If play fails, still advance so the user is not stuck
            introLater(afterSearchVideoEnds, 800);
        });
    }

    // Safety timer (~12.5s) if ended event is missed
    introLater(function () {
        if (!introFinished) {
            afterSearchVideoEnds();
        }
    }, 12500);
}

// Wire up the intro controls after the page HTML is ready
document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.getElementById("Intro_Search_Button");
    var skipLink = document.getElementById("Intro_Skip_Link");

    // Start on the gate stage with Earth video paused
    setIntroStage("Gate");
    showPausedGateVideo();

    if (searchBtn) {
        searchBtn.addEventListener("click", startCandidateSearch);
    }
    if (skipLink) {
        skipLink.addEventListener("click", skipIntro);
    }

    // Slideshow starts inside showPortfolio() after Skip or Search completes.
});
