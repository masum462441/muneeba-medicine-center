"use strict";


/* Elements */

const siteHeader =
    document.getElementById("siteHeader");

const menuButton =
    document.getElementById("menuButton");

const navMenu =
    document.getElementById("navMenu");

const navLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll("main section[id]");

const revealItems =
    document.querySelectorAll(".reveal");

const animatedCounter =
    document.getElementById("animatedCounter");

const certificateViewport =
    document.getElementById("certificateViewport");

const certificateSlides =
    Array.from(
        document.querySelectorAll(
            ".certificate-slide"
        )
    );

const previousCertificate =
    document.getElementById(
        "previousCertificate"
    );

const nextCertificate =
    document.getElementById(
        "nextCertificate"
    );

const sliderDots =
    document.getElementById("sliderDots");

const certificateCards =
    document.querySelectorAll(
        ".certificate-card"
    );

const certificateModal =
    document.getElementById(
        "certificateModal"
    );

const modalClose =
    document.getElementById("modalClose");

const modalImage =
    document.getElementById("modalImage");

const modalTitle =
    document.getElementById("modalTitle");

const appointmentForm =
    document.getElementById(
        "appointmentForm"
    );

const formStatus =
    document.getElementById("formStatus");

const currentYear =
    document.getElementById("currentYear");


/* Header */

function updateHeader() {

    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 25
    );

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* Mobile Menu */

function closeMenu() {

    if (!menuButton || !navMenu) {
        return;
    }

    menuButton.classList.remove("active");
    navMenu.classList.remove("active");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

}


if (menuButton && navMenu) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                navMenu.classList.toggle(
                    "active"
                );

            menuButton.classList.toggle(
                "active",
                isOpen
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

}


document.addEventListener(
    "click",
    (event) => {

        if (!menuButton || !navMenu) {
            return;
        }

        const clickedInsideMenu =
            navMenu.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (
            !clickedInsideMenu &&
            !clickedMenuButton
        ) {
            closeMenu();
        }

    }
);


window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 930) {
            closeMenu();
        }

    }
);


/* Smooth Scroll */

document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const selector =
                    link.getAttribute("href");

                if (
                    !selector ||
                    selector === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        selector
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                closeMenu();

                const headerHeight =
                    siteHeader
                        ? siteHeader.offsetHeight + 10
                        : 100;

                const targetTop =
                    target
                        .getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({

                    top: targetTop,
                    behavior: "smooth"

                });

            }
        );

    });


/* Active Navigation */

function updateActiveNavigation() {

    const currentPosition =
        window.scrollY + 170;

    let activeSection = "home";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;

        if (
            currentPosition >= sectionTop &&
            currentPosition < sectionBottom
        ) {
            activeSection = section.id;
        }

    });

    navLinks.forEach((link) => {

        link.classList.toggle(

            "active",

            link.getAttribute("href") ===
                `#${activeSection}`

        );

    });

}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* Reveal Animation */

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -30px 0px"
            }

        );

    revealItems.forEach((item) => {

        revealObserver.observe(item);

    });

} else {

    revealItems.forEach((item) => {

        item.classList.add("visible");

    });

}


/* 4500 Counter Animation */

function animateCounter(element) {

    if (
        !element ||
        element.dataset.started === "true"
    ) {
        return;
    }

    const target =
        Number(element.dataset.target);

    if (!Number.isFinite(target)) {
        return;
    }

    element.dataset.started = "true";

    const duration = 2300;

    const startedAt =
        performance.now();

    function updateCounter(currentTime) {

        const elapsed =
            currentTime - startedAt;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                4
            );

        const currentValue =
            Math.floor(
                target * easedProgress
            );

        element.textContent =
            new Intl.NumberFormat(
                "en-US"
            ).format(currentValue);

        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        } else {

            element.textContent =
                new Intl.NumberFormat(
                    "en-US"
                ).format(target);

        }

    }

    requestAnimationFrame(
        updateCounter
    );

}


if (
    animatedCounter &&
    "IntersectionObserver" in window
) {

    const counterObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    animateCounter(
                        entry.target
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.45
            }

        );

    counterObserver.observe(
        animatedCounter
    );

} else {

    animateCounter(
        animatedCounter
    );

}


/* Certificate Slider */

const sliderGap = 22;

let certificatesPerView = 3;

let currentCertificatePage = 0;

let totalCertificatePages = 1;

let sliderTimer = null;


function getCertificatesPerView() {

    if (window.innerWidth <= 700) {
        return 1;
    }

    if (window.innerWidth <= 1120) {
        return 2;
    }

    return 3;

}


function prepareCertificateSlider() {

    if (
        !certificateViewport ||
        certificateSlides.length === 0
    ) {
        return;
    }

    certificatesPerView =
        getCertificatesPerView();

    const availableWidth =
        certificateViewport.clientWidth;

    const totalGapWidth =
        sliderGap *
        (certificatesPerView - 1);

    const slideWidth =
        (
            availableWidth -
            totalGapWidth
        ) /
        certificatesPerView;

    certificateSlides.forEach((slide) => {

        slide.style.width =
            `${slideWidth}px`;

        slide.style.flexBasis =
            `${slideWidth}px`;

    });

    totalCertificatePages =
        Math.ceil(
            certificateSlides.length /
            certificatesPerView
        );

    currentCertificatePage = 0;

    createSliderDots();

    requestAnimationFrame(() => {

        certificateViewport.scrollLeft = 0;

        updateSliderControls();

    });

}


function getCertificatePagePosition(page) {

    const targetIndex =
        Math.min(

            page *
            certificatesPerView,

            certificateSlides.length - 1

        );

    const targetSlide =
        certificateSlides[targetIndex];

    const firstSlide =
        certificateSlides[0];

    if (!targetSlide || !firstSlide) {
        return 0;
    }

    return (
        targetSlide.offsetLeft -
        firstSlide.offsetLeft
    );

}


function moveToCertificatePage(
    page,
    smooth = true
) {

    if (!certificateViewport) {
        return;
    }

    currentCertificatePage =
        Math.max(

            0,

            Math.min(

                page,

                totalCertificatePages - 1

            )

        );

    certificateViewport.scrollTo({

        left:
            getCertificatePagePosition(
                currentCertificatePage
            ),

        behavior:
            smooth
                ? "smooth"
                : "auto"

    });

    updateSliderControls();

}


function createSliderDots() {

    if (!sliderDots) {
        return;
    }

    sliderDots.innerHTML = "";

    for (
        let index = 0;
        index < totalCertificatePages;
        index += 1
    ) {

        const dot =
            document.createElement(
                "button"
            );

        dot.type = "button";

        dot.className =
            "slider-dot";

        dot.setAttribute(

            "aria-label",

            `Certificate page ${index + 1}`

        );

        dot.addEventListener(
            "click",
            () => {

                moveToCertificatePage(
                    index
                );

                restartSlider();

            }
        );

        sliderDots.appendChild(dot);

    }

    updateSliderControls();

}


function updateSliderControls() {

    if (previousCertificate) {

        previousCertificate.disabled =
            currentCertificatePage === 0;

    }

    if (nextCertificate) {

        nextCertificate.disabled =
            currentCertificatePage >=
            totalCertificatePages - 1;

    }

    if (!sliderDots) {
        return;
    }

    sliderDots
        .querySelectorAll(".slider-dot")
        .forEach((dot, index) => {

            dot.classList.toggle(

                "active",

                index ===
                    currentCertificatePage

            );

        });

}


function detectCurrentSliderPage() {

    if (!certificateViewport) {
        return;
    }

    let nearestPage = 0;

    let nearestDistance =
        Infinity;

    for (
        let page = 0;
        page < totalCertificatePages;
        page += 1
    ) {

        const distance =
            Math.abs(

                certificateViewport.scrollLeft -

                getCertificatePagePosition(
                    page
                )

            );

        if (distance < nearestDistance) {

            nearestDistance = distance;

            nearestPage = page;

        }

    }

    currentCertificatePage =
        nearestPage;

    updateSliderControls();

}


function stopSlider() {

    if (!sliderTimer) {
        return;
    }

    clearInterval(sliderTimer);

    sliderTimer = null;

}


function startSlider() {

    stopSlider();

    if (totalCertificatePages <= 1) {
        return;
    }

    sliderTimer =
        setInterval(

            () => {

                const nextPage =

                    currentCertificatePage >=
                    totalCertificatePages - 1

                        ? 0

                        : currentCertificatePage + 1;

                moveToCertificatePage(
                    nextPage
                );

            },

            5500

        );

}


function restartSlider() {

    stopSlider();

    startSlider();

}


previousCertificate?.addEventListener(

    "click",

    () => {

        moveToCertificatePage(
            currentCertificatePage - 1
        );

        restartSlider();

    }

);


nextCertificate?.addEventListener(

    "click",

    () => {

        moveToCertificatePage(
            currentCertificatePage + 1
        );

        restartSlider();

    }

);


certificateViewport?.addEventListener(

    "scroll",

    detectCurrentSliderPage,

    { passive: true }

);


certificateViewport?.addEventListener(

    "mouseenter",

    stopSlider

);


certificateViewport?.addEventListener(

    "mouseleave",

    startSlider

);


certificateViewport?.addEventListener(

    "touchstart",

    stopSlider,

    { passive: true }

);


certificateViewport?.addEventListener(

    "touchend",

    startSlider,

    { passive: true }

);


window.addEventListener(

    "resize",

    () => {

        clearTimeout(
            window.certificateResizeTimer
        );

        window.certificateResizeTimer =
            setTimeout(

                prepareCertificateSlider,

                160

            );

    }

);


window.addEventListener(

    "load",

    () => {

        prepareCertificateSlider();

        startSlider();

    }

);


/* Certificate Modal */

function openCertificate(
    imageSource,
    certificateTitle
) {

    if (
        !certificateModal ||
        !modalImage ||
        !modalTitle
    ) {
        return;
    }

    stopSlider();

    modalImage.src =
        imageSource;

    modalImage.alt =
        certificateTitle;

    modalTitle.textContent =
        certificateTitle;

    certificateModal.classList.add(
        "active"
    );

    certificateModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeCertificate() {

    if (!certificateModal) {
        return;
    }

    certificateModal.classList.remove(
        "active"
    );

    certificateModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

    setTimeout(() => {

        if (modalImage) {

            modalImage.src = "";

            modalImage.alt = "";

        }

        if (modalTitle) {

            modalTitle.textContent = "";

        }

    }, 300);

    startSlider();

}


certificateCards.forEach((card) => {

    card.addEventListener(

        "click",

        () => {

            openCertificate(

                card.dataset.image,

                card.dataset.title ||
                    "Certificate"

            );

        }

    );

});


modalClose?.addEventListener(

    "click",

    closeCertificate

);


certificateModal?.addEventListener(

    "click",

    (event) => {

        if (
            event.target ===
            certificateModal
        ) {

            closeCertificate();

        }

    }

);


document.addEventListener(

    "keydown",

    (event) => {

        if (
            event.key === "Escape" &&

            certificateModal
                ?.classList.contains(
                    "active"
                )
        ) {

            closeCertificate();

        }

    }

);


/* Form Helpers */

function cleanText(value) {

    return String(value || "")

        .trim()

        .replace(/\s+/g, " ");

}


function showFormStatus(
    message,
    type
) {

    if (!formStatus) {
        return;
    }

    formStatus.textContent =
        message;

    formStatus.className =
        `form-status ${type}`;

    setTimeout(() => {

        formStatus.textContent = "";

        formStatus.className =
            "form-status";

    }, 5000);

}


function isValidPhone(phoneNumber) {

    const cleanedPhone =
        phoneNumber.replace(

            /[\s\-()]/g,

            ""

        );

    return /^(?:\+?88)?01[3-9]\d{8}$/
        .test(cleanedPhone);

}


/* WhatsApp Form */

appointmentForm?.addEventListener(

    "submit",

    (event) => {

        event.preventDefault();

        const patientName =
            cleanText(

                document
                    .getElementById(
                        "patientName"
                    )
                    ?.value

            );

        const patientPhone =
            cleanText(

                document
                    .getElementById(
                        "patientPhone"
                    )
                    ?.value

            );

        const serviceName =
            cleanText(

                document
                    .getElementById(
                        "serviceName"
                    )
                    ?.value

            );

        const patientMessage =
            cleanText(

                document
                    .getElementById(
                        "patientMessage"
                    )
                    ?.value

            );

        if (
            !patientName ||
            !patientPhone ||
            !serviceName
        ) {

            showFormStatus(

                "Please complete all required fields.",

                "error"

            );

            return;

        }

        if (!isValidPhone(patientPhone)) {

            showFormStatus(

                "Please enter a valid Bangladeshi mobile number.",

                "error"

            );

            return;

        }

        const whatsappMessage = [

            "Assalamu Alaikum,",

            "",

            "I would like to contact Muneeba Medicine Center.",

            "",

            `Name: ${patientName}`,

            `Phone: ${patientPhone}`,

            `Service: ${serviceName}`,

            patientMessage

                ? `Message: ${patientMessage}`

                : "Message: Not provided",

            "",

            "Please confirm the available time."

        ].join("\n");

        const whatsappURL =

            "https://wa.me/8801988195342" +

            `?text=${encodeURIComponent(
                whatsappMessage
            )}`;

        showFormStatus(

            "Opening WhatsApp...",

            "success"

        );

        setTimeout(() => {

            window.open(

                whatsappURL,

                "_blank",

                "noopener,noreferrer"

            );

        }, 300);

    }

);


/* Current Year */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* External Link Security */

document
    .querySelectorAll(
        'a[target="_blank"]'
    )
    .forEach((link) => {

        const relValues =
            new Set(

                (
                    link.getAttribute("rel") ||
                    ""
                )

                    .split(/\s+/)

                    .filter(Boolean)

            );

        relValues.add("noopener");

        relValues.add("noreferrer");

        link.setAttribute(

            "rel",

            [...relValues].join(" ")

        );

    });