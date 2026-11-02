const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
  navLinks?.classList.toggle("is-open", !isOpen);
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Открыть меню");
  });
});

document.querySelectorAll(".project-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".project-filter").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.kind !== filter;
    });
  });
});

document.querySelectorAll(".faq details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) document.querySelectorAll(".faq details").forEach((other) => { if (other !== item) other.open = false; });
  });
});

const leadForm = document.querySelector("#lead-form");
const leadStatus = document.querySelector("#lead-form-status");

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;

  const submitButton = leadForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = "Отправляем…";
  leadStatus.textContent = "";
  leadStatus.classList.remove("is-error");

  try {
    const response = await fetch(leadForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(leadForm))),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Не удалось отправить заявку. Попробуйте ещё раз.");
    leadForm.reset();
    leadStatus.textContent = "Спасибо! Заявка отправлена. Мы скоро свяжемся с вами.";
  } catch (error) {
    leadStatus.textContent = error.message || "Не удалось отправить заявку. Попробуйте ещё раз.";
    leadStatus.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});
