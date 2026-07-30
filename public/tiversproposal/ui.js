const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelector(".search-button")?.addEventListener("click", () => {
  const query = window.prompt("Find a word or phrase on this page");
  if (query?.trim()) window.find(query.trim(), false, false, true);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector(".search-button")?.click();
  }
  if (event.key === "Escape") {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }
});
