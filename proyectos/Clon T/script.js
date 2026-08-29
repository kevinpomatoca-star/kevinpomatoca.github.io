// Datos de respaldo en caso de abrir como file:/// (sin servidor web local)
const fallbackData = {
  "usuario": {
    "nombre": "Carlos Mendoza",
    "telefono": "+57 312 456 7890"
  },
  "saldo": {
    "monto": "$ 25.500",
    "moneda": "COP",
    "fechaVence": "Vence 30/08/2026",
    "detalleCombo": "Incluye un combo"
  },
  "paquetes": [
    {
      "id": "datos",
      "tipo": "DATOS",
      "disponible": "8.5 GB",
      "total": "12 GB",
      "porcentaje": 70,
      "color": "#ff2a7a"
    },
    {
      "id": "voz",
      "tipo": "VOZ",
      "disponible": "350 Min",
      "total": "500 Min",
      "porcentaje": 70,
      "color": "#00d2ff"
    },
    {
      "id": "sms",
      "tipo": "SMS",
      "disponible": "180 SMS",
      "total": "200 SMS",
      "porcentaje": 90,
      "color": "#10b981"
    }
  ],
  "banners": [
    {
      "id": 1,
      "titulo": "¡Duplica tus Gigas hoy!",
      "subtitulo": "Recarga desde $10.000 y recibe el doble",
      "badge": "PROMO TOP",
      "fondo": "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      "icono": "⚡"
    },
    {
      "id": 2,
      "titulo": "Pasa Gigas a tus amigos",
      "subtitulo": "Sin costo adicional en tu plan actual",
      "badge": "NUEVO",
      "fondo": "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
      "icono": "🎁"
    },
    {
      "id": 3,
      "titulo": "Suscripción Premium Gratis",
      "subtitulo": "3 meses de música sin límites incluidos",
      "badge": "BENEFICIO",
      "fondo": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      "icono": "🎵"
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  setupInteracciones();
});

/**
 * Carga los datos desde data.json con soporte de fallback
 */
async function cargarDatos() {
  try {
    const respuesta = await fetch("data.json");
    if (!respuesta.ok) throw new Error("No se pudo cargar data.json");
    const data = await respuesta.json();
    renderizarInterfaz(data);
  } catch (error) {
    console.warn("Cargando datos locales de respaldo:", error);
    renderizarInterfaz(fallbackData);
  }
}

/**
 * Renderiza todos los módulos dinámicos de la interfaz móvil
 */
function renderizarInterfaz(data) {
  // 1. Header (Usuario y Teléfono)
  if (data.usuario) {
    document.getElementById("user-name").textContent = data.usuario.nombre || "Usuario";
    document.getElementById("user-phone").textContent = data.usuario.telefono || "";
  }

  // 2. Banners Publicitarios (3 Banners)
  renderizarBanners(data.banners || []);

  // 3. Carta Principal
  if (data.saldo) {
    document.getElementById("balance-amount").textContent = data.saldo.monto || "$ 0";
    document.getElementById("expiry-date").textContent = data.saldo.fechaVence || "Vence 30/08/2026";
    document.getElementById("combo-detail").textContent = data.saldo.detalleCombo || "Incluye un combo";
  }

  // 3.3 Contenedores de Donas (DATOS, VOZ, SMS)
  renderizarDonas(data.paquetes || []);
}

// Variables de control del Slider
let sliderInterval = null;
let currentBannerIndex = 0;

/**
 * Renderiza los 3 banners publicitarios en una sola fila e inicializa el slider automático
 */
function renderizarBanners(banners) {
  const container = document.getElementById("banners-container");
  const dotsContainer = document.getElementById("banners-dots");
  if (!container) return;

  container.innerHTML = "";
  if (dotsContainer) dotsContainer.innerHTML = "";

  const totalBanners = banners.length;
  currentBannerIndex = 0;

  // 1. Renderizar cada banner en la fila
  banners.forEach((banner, index) => {
    const bannerEl = document.createElement("article");
    bannerEl.className = "banner-card";
    bannerEl.style.background = banner.fondo;
    bannerEl.setAttribute("role", "region");
    bannerEl.setAttribute("aria-label", banner.titulo);

    bannerEl.innerHTML = `
      <div class="banner-content">
        <span class="banner-badge">${banner.badge}</span>
        <h3 class="banner-title">${banner.titulo}</h3>
        <p class="banner-subtitle">${banner.subtitulo}</p>
      </div>
      <div class="banner-icon-side" aria-hidden="true">${banner.icono}</div>
    `;

    container.appendChild(bannerEl);

    // Renderizar indicador (dot)
    if (dotsContainer) {
      const dot = document.createElement("button");
      dot.className = `dot ${index === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Ir al Banner ${index + 1}`);
      dot.addEventListener("click", () => {
        irAlBanner(index, totalBanners);
        reiniciarAutoSlide(totalBanners);
      });
      dotsContainer.appendChild(dot);
    }
  });

  // 2. Inicializar posición y auto-deslizamiento
  irAlBanner(0, totalBanners);
  iniciarAutoSlide(totalBanners);

  // 3. Soporte para gestos táctiles (Swipe) en móvil
  configurarSwipeSlider(container, totalBanners);
}

/**
 * Mueve el slider al índice especificado
 */
function irAlBanner(index, total) {
  if (total === 0) return;
  currentBannerIndex = (index + total) % total;

  const container = document.getElementById("banners-container");
  if (container) {
    container.style.transform = `translateX(-${currentBannerIndex * 100}%)`;
  }

  // Actualizar dots
  const dots = document.querySelectorAll("#banners-dots .dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentBannerIndex);
  });
}

/**
 * Inicia el temporizador de 4 segundos para el bucle automático
 */
function iniciarAutoSlide(total) {
  detenerAutoSlide();
  sliderInterval = setInterval(() => {
    irAlBanner(currentBannerIndex + 1, total);
  }, 4000); // Bucle cada 4 segundos
}

/**
 * Detiene el auto-slide
 */
function detenerAutoSlide() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
    sliderInterval = null;
  }
}

/**
 * Reinicia el temporizador de 4 segundos tras una interacción
 */
function reiniciarAutoSlide(total) {
  detenerAutoSlide();
  iniciarAutoSlide(total);
}

/**
 * Agrega soporte de deslizamiento táctil (Touch / Swipe) en móvil
 */
function configurarSwipeSlider(container, total) {
  let touchStartX = 0;
  let touchEndX = 0;

  const wrapper = container.parentElement;
  if (!wrapper) return;

  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    detenerAutoSlide();
  }, { passive: true });

  wrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diffX = touchStartX - touchEndX;

    // Desplazamiento mayor a 40px se considera swipe
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swipe izquierda -> siguiente
        irAlBanner(currentBannerIndex + 1, total);
      } else {
        // Swipe derecha -> anterior
        irAlBanner(currentBannerIndex - 1, total);
      }
    }
    reiniciarAutoSlide(total);
  }, { passive: true });

  // Pausar al pasar el mouse por encima (en caso de testing en desktop)
  wrapper.addEventListener("mouseenter", detenerAutoSlide);
  wrapper.addEventListener("mouseleave", () => reiniciarAutoSlide(total));
}

/**
 * Renderiza los 3 medidores con gráfico circular tipo Dona
 */
function renderizarDonas(paquetes) {
  const container = document.getElementById("meters-container");
  container.innerHTML = "";

  const radius = 30;
  const circumference = 2 * Math.PI * radius; // ~188.495

  paquetes.forEach((paquete, index) => {
    const meterCard = document.createElement("div");
    meterCard.className = "meter-card";

    // SVG Circular Donut Chart
    meterCard.innerHTML = `
      <span class="meter-title">${paquete.tipo}</span>
      <div class="donut-wrapper">
        <svg class="donut-svg" viewBox="0 0 70 70">
          <circle class="donut-bg-circle" cx="35" cy="35" r="${radius}"></circle>
          <circle 
            class="donut-progress-circle" 
            id="donut-circle-${index}" 
            cx="35" 
            cy="35" 
            r="${radius}" 
            style="stroke: ${paquete.color || '#582be8'};"
          ></circle>
        </svg>
        <span class="donut-center-text">${paquete.porcentaje}%</span>
      </div>
      <span class="meter-disponible">${paquete.disponible}</span>
      <span class="meter-total">de ${paquete.total}</span>
    `;

    container.appendChild(meterCard);

    // Animación suave de la dona
    setTimeout(() => {
      const circleEl = document.getElementById(`donut-circle-${index}`);
      if (circleEl) {
        const offset = circumference - (paquete.porcentaje / 100) * circumference;
        circleEl.style.strokeDasharray = `${circumference}`;
        circleEl.style.strokeDashoffset = `${offset}`;
      }
    }, 150 * (index + 1));
  });
}

/**
 * Configura listeners de eventos e interactividad
 */
function setupInteracciones() {
  const btnBuy = document.getElementById("btn-buy");
  if (btnBuy) {
    btnBuy.addEventListener("click", () => {
      window.location.href = "../Tablero de Proyectos/index.html";
    });
  }
}
