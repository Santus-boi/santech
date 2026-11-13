
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENT SELECTORS
    // =====================================================

    const body = document.body;
    const pageLoader = document.querySelector(".page-loader");
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const backToTop = document.querySelector(".back-to-top");
    const currentYear = document.getElementById("currentYear");


    // =====================================================
    // 1. PAGE LOADER
    // =====================================================

    const hidePageLoader = () => {
        if (pageLoader) {
            pageLoader.classList.add("loaded");
        }
    };

    window.addEventListener("load", hidePageLoader);

    // Prevent the loader from remaining visible indefinitely.
    if (document.readyState === "complete") {
        hidePageLoader();
    }


    // =====================================================
    // 2. CURRENT FOOTER YEAR
    // =====================================================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // =====================================================
    // 3. LUCIDE ICON INITIALIZATION
    // =====================================================

    const initializeIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    };

    initializeIcons();


    // =====================================================
    // 4. MOBILE NAVIGATION
    // =====================================================

    const closeMobileMenu = () => {

        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        body.classList.remove("menu-open");

        // Restore the menu icon.
        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.setAttribute("data-lucide", "menu");
            initializeIcons();
        }
    };


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen = mainNav.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            body.classList.toggle("menu-open", isOpen);

            // Change the icon.
            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.setAttribute(
                    "data-lucide",
                    isOpen ? "x" : "menu"
                );

                initializeIcons();
            }

        });


        // Close menu when a navigation link is clicked.
        mainNav.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {
                closeMobileMenu();
            });

        });


        // Close menu when clicking outside.
        document.addEventListener("click", (event) => {

            const clickedInsideNav = mainNav.contains(event.target);
            const clickedMenuButton = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedMenuButton) {
                closeMobileMenu();
            }

        });


        // Close menu using Escape.
        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        });


        // Close menu when returning to desktop screen size.
        window.addEventListener("resize", () => {

            if (window.innerWidth > 991) {
                closeMobileMenu();
            }

        });

    }


    // =====================================================
    // 5. STICKY HEADER
    // =====================================================

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    // =====================================================
    // 6. ACTIVE NAVIGATION LINK
    // =====================================================

    const getCurrentPage = () => {

        const pathname = window.location.pathname;

        const page = pathname.split("/").filter(Boolean).pop();

        if (!page || !page.includes(".")) {
            return "index.html";
        }

        return page.toLowerCase();

    };


    const currentPage = getCurrentPage();

    if (mainNav) {

        mainNav.querySelectorAll("a").forEach((link) => {

            const href = link.getAttribute("href");

            if (!href) return;

            const linkPage = href.split("/").pop().toLowerCase();

            if (linkPage === currentPage) {

                link.classList.add("active");

                link.setAttribute("aria-current", "page");

            } else {

                link.classList.remove("active");

                link.removeAttribute("aria-current");

            }

        });

    }


    // =====================================================
    // 7. SCROLL REVEAL ANIMATIONS
    // =====================================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        // Fallback for older browsers.
        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    // =====================================================
    // 8. BACK TO TOP BUTTON
    // =====================================================

    const updateBackToTop = () => {

        if (!backToTop) return;

        backToTop.classList.toggle(
            "show",
            window.scrollY > 400
        );

    };


    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();


    if (backToTop) {

        backToTop.addEventListener("click", (event) => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =====================================================
    // 9. SMOOTH SCROLL FOR INTERNAL ANCHORS
    // =====================================================

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

        anchor.addEventListener("click", (event) => {

            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    // =====================================================
    // 10. CLOSE MOBILE MENU WHEN PAGE IS HIDDEN
    // =====================================================

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            closeMobileMenu();
        }

    });


    // =====================================================
    // 11. ACCESSIBILITY: REDUCED MOTION
    // =====================================================

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (prefersReducedMotion.matches) {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    // =====================================================
    // INITIALIZATION COMPLETE
    // =====================================================

    console.log("Santech Global initialized successfully.");

});

/* =========================================================
   CONTACT FORM — WHATSAPP SUBMISSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);

        const name = formData.get("fullName").trim();
        const email = formData.get("email").trim();
        const company = formData.get("company").trim();
        const projectType = formData.get("projectType");
        const budget = formData.get("budget") || "Not specified";
        const timeline = formData.get("timeline") || "Not specified";
        const message = formData.get("message").trim();

        const whatsappMessage = `
NEW PROJECT ENQUIRY

Name: ${name}
Email: ${email}
Business / Organization: ${company || "Not specified"}

Project Type: ${projectType}
Estimated Budget: ${budget}
Timeline: ${timeline}

PROJECT DETAILS:
${message}

Sent through the Santech Global website.
        `.trim();

        const whatsappURL =
            "https://wa.me/2348145431125?text=" +
            encodeURIComponent(whatsappMessage);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
});
