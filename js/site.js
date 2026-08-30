(() => {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (toggle && nav && menu) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!name || !email || !message) return;

      form.classList.add("is-sent");
      const success = form.querySelector("[data-form-success]");
      if (success) success.classList.add("is-show");

      const subject = encodeURIComponent(`ParkNav: ${data.get("topic") || "Question"}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      form.dataset.mailto = `mailto:support@parknav.app?subject=${subject}&body=${body}`;
    });
  }

  const navEl = document.querySelector("[data-nav]");
  if (navEl && !navEl.classList.contains("is-solid")) {
    const onScroll = () => {
      navEl.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-mode");
      document.querySelectorAll("[data-mode]").forEach((el) => el.classList.remove("is-on"));
      button.classList.add("is-on");
      document.querySelectorAll("[data-mode-image]").forEach((img) => {
        img.classList.toggle("is-show", img.getAttribute("data-mode-image") === target);
      });
    });
  });
})();
