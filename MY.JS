"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const header = $("header");
  const progress = $("#scrollProgress");
  const backToTop = $("#backToTop");
  const navLinks = $$(".nav-menu a");

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#") || href.length < 2) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  const sectionIds = ["Home", "Gallery", "Rooms", "About", "Contact"];
  function setActiveSection() {
    const y = window.scrollY + 140;
    let current = "Home";

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = id;
    });

    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", href === `#${current}`);
    });
  }

  function updateScrollUI() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progress) progress.style.width = `${pct}%`;
    if (header) header.classList.toggle("is-sticky", scrollTop > 30);
    if (backToTop) backToTop.classList.toggle("show", scrollTop > 500);

    setActiveSection();
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  const newsletterForm = $("#newsletterForm");
  const newsletterEmail = $("#newsletterEmail");
  const newsletterMsg = $("#newsletterMsg");

  if (newsletterForm && newsletterEmail && newsletterMsg) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (newsletterEmail.value || "").trim();

      if (!email) {
        newsletterMsg.textContent = "Please enter your email.";
        return;
      }

      newsletterMsg.textContent = "Thanks! You're subscribed.";
      newsletterEmail.value = "";
      window.setTimeout(() => (newsletterMsg.textContent = ""), 3000);
    });
  }

  const liveTime = $("#liveTime");
  const liveDate = $("#liveDate");

  function updateDateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    if (liveTime) liveTime.textContent = `${hh}:${mm}:${ss}`;
    if (liveDate) {
      liveDate.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  if (liveTime || liveDate) {
    updateDateTime();
    window.setInterval(updateDateTime, 1000);
  }

  const aboutSlides = $$(".about-slide");
  if (aboutSlides.length > 1) {
    let idx = 0;
    window.setInterval(() => {
      aboutSlides[idx].classList.remove("active");
      idx = (idx + 1) % aboutSlides.length;
      aboutSlides[idx].classList.add("active");
    }, 4000);
  }

  const aboutTrigger = $("#aboutTrigger");
  const aboutContent = $("#aboutContent");
  if (aboutTrigger && aboutContent) {
    aboutTrigger.addEventListener("click", () => {
      const isOpen = aboutTrigger.getAttribute("aria-expanded") === "true";
      aboutTrigger.setAttribute("aria-expanded", String(!isOpen));
      aboutContent.classList.toggle("open", !isOpen);
    });
  }

  const accordionButtons = $$(".accordion-toggle");
  accordionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      accordionButtons.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const c = b.parentElement?.querySelector(".accordion-content");
        if (c) c.classList.remove("open");
      });

      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        const content = btn.parentElement?.querySelector(".accordion-content");
        if (content) content.classList.add("open");
      }
    });
  });
});
