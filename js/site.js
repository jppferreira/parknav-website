/** Replace YOUR_ACCESS_KEY with the key from https://web3forms.com. Same placeholder as the app. */
const WEB3FORMS_ACCESS_KEY = "11b825cf-fa7c-4382-a56a-4fd59727de77";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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

  const modal = document.createElement("div");
  modal.className = "contact-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="contact-modal-backdrop" data-close-contact></div>
    <div class="contact-modal-panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button class="contact-modal-close" type="button" data-close-contact aria-label="Close">×</button>
      <h2 class="display" id="contact-modal-title">Tell us what’s going on.</h2>
      <p class="lede">Support, privacy, and billing. Fill this in and send it from here.</p>
      <form class="form" name="contact-modal" data-contact-form>
        <div class="form-fields">
          <div class="field">
            <label for="modal-name">Name</label>
            <input id="modal-name" name="name" type="text" autocomplete="name" placeholder=" " required>
          </div>
          <div class="field">
            <label for="modal-email">Email</label>
            <input id="modal-email" name="email" type="email" autocomplete="email" placeholder=" " required>
          </div>
          <div class="field">
            <label for="modal-topic">Topic</label>
            <select id="modal-topic" name="topic">
              <option value="Support">Support</option>
              <option value="Privacy">Privacy</option>
              <option value="Billing">Billing</option>
              <option value="Press">Press</option>
              <option value="Something else">Something else</option>
            </select>
          </div>
          <div class="field">
            <label for="modal-message">Message</label>
            <textarea id="modal-message" name="message" placeholder=" " required></textarea>
          </div>
          <div class="field hp" aria-hidden="true">
            <label for="modal-company">Company</label>
            <input id="modal-company" name="_honey" type="text" tabindex="-1" autocomplete="off">
          </div>
          <button class="btn" type="submit">Send message</button>
          <p class="form-error" data-form-error role="alert"></p>
        </div>
        <div class="form-success" data-form-success>
          <h2 class="display">Got it.</h2>
          <p class="lede">🙏 Thank you for contacting us, we'll get back to you as soon as possible.</p>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  let lastFocus = null;

  const openContactModal = (topic) => {
    const topicField = modal.querySelector("[name=topic]");
    if (topicField && topic && [...topicField.options].some((option) => option.value === topic)) {
      topicField.value = topic;
    }
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("#modal-name")?.focus();
  };

  const closeContactModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-contact], a[href^='mailto:support@parknav.app']");
    if (opener) {
      event.preventDefault();
      openContactModal(opener.getAttribute("data-topic") || "");
      return;
    }
    if (event.target.closest("[data-close-contact]")) closeContactModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeContactModal();
  });

  const bindContactForm = (form, hideFieldsOnSuccess) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const topic = String(data.get("topic") || "Question").trim();
      const honey = String(data.get("_honey") || "").trim();
      if (!name || !email || !message) return;

      const showSuccess = () => {
        if (hideFieldsOnSuccess) form.classList.add("is-sent");
        form.querySelector("[data-form-success]")?.classList.add("is-show");
      };

      if (honey) {
        showSuccess();
        return;
      }

      const error = form.querySelector("[data-form-error]");
      error?.classList.remove("is-show", "is-mail");
      const showError = (text) => {
        if (!error) return;
        error.textContent = text;
        error.classList.add("is-show");
      };

      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY") {
        showError("Feedback email isn’t set up yet. Add a Web3Forms access key in js/site.js.");
        return;
      }

      const button = form.querySelector("button[type=submit]");
      if (button) button.disabled = true;
      try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name,
            email,
            replyto: email,
            topic,
            subject: `ParkNav: ${topic}`,
            message,
            from_name: "ParkNav",
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (response.ok && payload.success !== false) {
          showSuccess();
          return;
        }
        showError("Couldn’t send that. Check your connection and try again.");
      } catch {
        showError("Couldn’t send that. Check your connection and try again.");
      } finally {
        if (button) button.disabled = false;
      }
    });
  };

  const bindFloatingField = (field) => {
    const control = field.querySelector("input, textarea, select");
    if (!control || field.classList.contains("hp")) return;
    const sync = () => {
      const filled = control.tagName === "SELECT" || control.value.length > 0;
      field.classList.toggle("is-raised", filled);
    };
    sync();
    control.addEventListener("input", sync);
    control.addEventListener("change", sync);
  };

  document.querySelectorAll(".field").forEach(bindFloatingField);

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    bindContactForm(form, form.closest(".contact-modal") !== null);
  });

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
