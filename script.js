const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const supportsIntersectionObserver = "IntersectionObserver" in window;

const animateCounter = (counter) => {
  if (counter.dataset.counted === "true") return;

  counter.dataset.counted = "true";
  const target = Number(counter.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toLocaleString("pt-BR");

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (supportsIntersectionObserver) {
  counters.forEach((counter) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(counter);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(counter);
  });

  revealItems.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min(index % 3, 2) * 80}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -48px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  counters.forEach((counter) => {
    counter.textContent = Number(counter.dataset.target || 0).toLocaleString("pt-BR");
  });
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
