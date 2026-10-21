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
    const topicField = form.querySelector("[name=topic]");
    const requestedTopic = new URLSearchParams(window.location.search).get("topic");
    if (topicField && requestedTopic) {
      const match = [...topicField.options].some((option) => option.value === requestedTopic);
      if (match) topicField.value = requestedTopic;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const topic = String(data.get("topic") || "Question").trim();
      const honey = String(data.get("_honey") || "").trim();
      if (!name || !email || !message) return;

      if (honey) {
        form.classList.add("is-sent");
        form.querySelector("[data-form-success]")?.classList.add("is-show");
        return;
      }

      const button = form.querySelector("button[type=submit]");
      const error = form.querySelector("[data-form-error]");
      error?.classList.remove("is-show");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      try {
        const response = await fetch("https://formsubmit.co/ajax/05fc019c5550d0820636caffc1434189", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            topic,
            message,
            _subject: `ParkNav: ${topic}`,
            _template: "table",
            _captcha: "false",
            _replyto: email,
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || String(payload.success) !== "true") {
          throw new Error(payload.message || "send failed");
        }

        form.classList.add("is-sent");
        form.querySelector("[data-form-success]")?.classList.add("is-show");
      } catch {
        if (error) {
          error.textContent = "We couldn’t send that. Check your connection and try again.";
          error.classList.add("is-show");
        }
        if (button) {
          button.disabled = false;
          button.textContent = "Send message";
        }
      }
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
