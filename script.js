const themeButton = document.getElementById("themeButton");
const themeTransition = document.getElementById("themeTransition");
const dataUrl = "data.json?v=2026.08.26";

function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeButton.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
    themeButton.title = isDark ? "Activar modo claro" : "Activar modo oscuro";
}

themeButton.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    setTheme(isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    themeTransition.classList.add("is-visible");
    window.setTimeout(() => themeTransition.classList.remove("is-visible"), 500);
});
setTheme(localStorage.getItem("portfolio-theme") !== "light");

const projectCards = [...document.querySelectorAll(".project-card")];
const projectFilters = [...document.querySelectorAll(".project-filter")];
projectFilters.forEach((filter) => filter.addEventListener("click", () => {
    projectFilters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => card.classList.toggle("is-hidden", filter.dataset.filter !== "all" && card.dataset.project !== filter.dataset.filter));
}));

const track = document.getElementById("sliderTrack");
const slides = [...document.querySelectorAll(".slide")];
const dotsContainer = document.getElementById("dotsContainer");
slides.forEach((slide, index) => {
    const image = slide.querySelector("img");
    if (image && index > 0) image.loading = "lazy";
    if (image) image.decoding = "async";
});
let currentIndex = 0;
let slideInterval;
function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    [...dotsContainer.children].forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
}
function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    clearInterval(slideInterval);
    slideInterval = window.setInterval(() => goToSlide((currentIndex + 1) % slides.length), 3500);
}
slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `dot${index === 0 ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir al proyecto ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
});
document.getElementById("nextBtn").addEventListener("click", () => goToSlide((currentIndex + 1) % slides.length));
document.getElementById("prevBtn").addEventListener("click", () => goToSlide((currentIndex - 1 + slides.length) % slides.length));
slideInterval = window.setInterval(() => goToSlide((currentIndex + 1) % slides.length), 3500);

const flipbookBook = document.getElementById("flipbookBook");
const flipbookLeft = document.getElementById("flipbookLeft");
const flipbookRight = document.getElementById("flipbookRight");
const flipbookTurn = document.getElementById("flipbookTurn");
const flipbookCounter = document.getElementById("flipbookCounter");
let flipbookPages = [];
let flipbookIndex = 0;
let flipbookStartX = 0;
let flipbookDragging = false;

function renderFlipbook() {
    if (!flipbookPages.length) return;
    const leftPage = flipbookPages[flipbookIndex] || flipbookPages[flipbookPages.length - 1];
    const rightPage = flipbookPages[flipbookIndex + 1] || flipbookPages[0];
    flipbookLeft.innerHTML = pageMarkup(leftPage, "left");
    flipbookRight.innerHTML = pageMarkup(rightPage, "right");
    flipbookCounter.textContent = `${String(flipbookIndex + 1).padStart(2, "0")} / ${String(flipbookPages.length).padStart(2, "0")}`;
}
function pageMarkup(page, side) {
    return `<span class="book-page-number">${page.numero}</span><span class="book-page-kicker">${page.kicker}</span><h3>${page.titulo}</h3><p>${page.texto}</p><span class="book-page-side">${side === "left" ? "Kevin / proceso" : "Portafolio 2026"}</span>`;
}
function turnFlipbook(direction) {
    const nextIndex = flipbookIndex + direction * 2;
    if (nextIndex < 0 || nextIndex >= flipbookPages.length) return;
    flipbookTurn.innerHTML = pageMarkup(flipbookPages[direction > 0 ? flipbookIndex + 1 : flipbookIndex], direction > 0 ? "right" : "left");
    flipbookBook.classList.remove("turn-next", "turn-prev");
    void flipbookBook.offsetWidth;
    flipbookBook.classList.add(direction > 0 ? "turn-next" : "turn-prev");
    window.setTimeout(() => { flipbookIndex = nextIndex; renderFlipbook(); flipbookBook.classList.remove("turn-next", "turn-prev"); }, 620);
}
function bindFlipbook() {
    document.getElementById("flipbookPrev").addEventListener("click", () => turnFlipbook(-1));
    document.getElementById("flipbookNext").addEventListener("click", () => turnFlipbook(1));
    flipbookBook.addEventListener("pointerdown", (event) => { flipbookStartX = event.clientX; flipbookDragging = true; flipbookBook.setPointerCapture(event.pointerId); });
    flipbookBook.addEventListener("pointerup", (event) => { if (!flipbookDragging) return; flipbookDragging = false; const distance = event.clientX - flipbookStartX; if (Math.abs(distance) > 70) turnFlipbook(distance < 0 ? 1 : -1); });
    flipbookBook.addEventListener("pointercancel", () => { flipbookDragging = false; });
}

defineContent();
const profileImage = document.getElementById("profileImage");
const profileCoin = profileImage.querySelector(".profile-coin");
let coinTimeout;
function startCoinFlip() {
    profileCoin.classList.remove("coin-forward", "coin-back");
    void profileCoin.offsetWidth;
    profileCoin.classList.add("coin-forward");
    profileCoin.addEventListener("animationend", showInformalSide, { once: true });
}
function showInformalSide() {
    coinTimeout = window.setTimeout(() => {
        profileCoin.classList.remove("coin-forward");
        void profileCoin.offsetWidth;
        profileCoin.classList.add("coin-back");
        profileCoin.addEventListener("animationend", showMainSide, { once: true });
    }, 15000);
}
function showMainSide() {
    profileCoin.classList.remove("coin-forward", "coin-back");
    coinTimeout = window.setTimeout(startCoinFlip, 15000);
}
coinTimeout = window.setTimeout(startCoinFlip, 15000);
async function defineContent() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error("No se pudo cargar data.json");
        const portfolioData = await response.json();
        flipbookPages = portfolioData.flipbook || [];
        renderFlipbook();
        bindFlipbook();
        document.getElementById("certificateGrid").innerHTML = portfolioData.certificados.map((item) => `<article class="certificate-card"><span>${item.anio}</span><h3>${item.nombre}</h3><p>${item.institucion}</p></article>`).join("");
        document.getElementById("socialLinks").innerHTML = portfolioData.redes.map((item) => `<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${item.nombre}" title="${item.nombre}"><span class="social-icon social-${item.icono}">${item.icono === "github" ? "GH" : item.icono === "linkedin" ? "in" : "◎"}</span></a>`).join("");
    } catch (error) {
        console.error(error);
    }
}
