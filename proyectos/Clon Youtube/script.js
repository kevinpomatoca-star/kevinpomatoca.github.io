/**
 * YouTube Clone - JavaScript Logic
 * Handles data fetching (with offline/file:// fallback), dynamic rendering,
 * category filtering, search, hover video previews, sidebar toggling, and video modal player.
 */

// Fallback data for when opening directly with file:/// protocol without a web server (CORS restriction)
const DEFAULT_VIDEOS = [
  {
    id: 1,
    title: "La crisis geopolítica que nadie vio venir en Europa y el mundo",
    channel: "DW Español",
    channelLogo: "canal/dw/logo.png",
    cover: "canal/dw/portada-2.png",
    video: "canal/dw/portada-2-video.mp4",
    views: "1.4 M de vistas",
    uploaded: "hace 3 semanas",
    duration: "14:28",
    category: "noticias",
    isShort: false
  },
  {
    id: 2,
    title: "Explicación detallada del final más impactante del cine de ciencia ficción",
    channel: "MovieGasm",
    channelLogo: "canal/moviegasm/logo.png",
    cover: "canal/moviegasm/portada-1.png",
    video: "canal/moviegasm/portada-1-video.mp4",
    views: "620 K de vistas",
    uploaded: "hace 1 mes",
    duration: "10:15",
    category: "peliculas",
    isShort: false
  },
  {
    id: 3,
    title: "El experimento científico que desafía las leyes de la física clásica",
    channel: "Veritasium en Español",
    channelLogo: "canal/veritasium/logo.png",
    cover: "canal/veritasium/portada-1.png",
    views: "450 K de vistas",
    uploaded: "hace 5 días",
    duration: "18:40",
    category: "ciencia",
    isShort: false
  },
  {
    id: 4,
    title: "¿Cómo reacciona la gente al ver esto en vivo? 😂",
    channel: "Charles",
    channelLogo: "canal/charles/logo.png",
    cover: "canal/charles/portada-1.png",
    video: "canal/charles/short-1.mp4",
    views: "1.8 M de vistas",
    uploaded: "hace 2 días",
    duration: "0:45",
    category: "entretenimiento",
    isShort: true
  },
  {
    id: 5,
    title: "Reportaje especial: Investigación exclusiva sobre las nuevas tecnologías",
    channel: "BN Periodismo",
    channelLogo: "canal/bn periodismo/logo.png",
    cover: "canal/bn periodismo/portada-1.png",
    views: "98 K de vistas",
    uploaded: "hace 12 horas",
    duration: "22:10",
    category: "noticias",
    isShort: false
  },
  {
    id: 6,
    title: "Cuando tu mejor amigo intenta darte consejos de pareja",
    channel: "Enchufe TV",
    channelLogo: "canal/enchufe tv/logo.png",
    cover: "canal/enchufe tv/portada-1.png",
    views: "3.1 M de vistas",
    uploaded: "hace 4 días",
    duration: "07:35",
    category: "comedia",
    isShort: false
  },
  {
    id: 7,
    title: "Las fronteras invisibles que definieron el mapa moderno",
    channel: "Historia Geopolítica",
    channelLogo: "canal/historia geopolitica/logo.png",
    cover: "canal/historia geopolitica/portada-1.png",
    views: "380 K de vistas",
    uploaded: "hace 1 semana",
    duration: "16:50",
    category: "historia",
    isShort: false
  },
  {
    id: 8,
    title: "Curiosidades impactantes en 30 segundos #Shorts",
    channel: "DW Español",
    channelLogo: "canal/dw/logo.png",
    cover: "canal/dw/portada-1.png",
    video: "canal/dw/short-1.mp4",
    views: "890 K de vistas",
    uploaded: "hace 6 días",
    duration: "0:30",
    category: "noticias",
    isShort: true
  },
  {
    id: 9,
    title: "Los mejores easter eggs y detalles ocultos que te perdiste",
    channel: "Comentando Películas",
    channelLogo: "canal/comentando peliculas/logo.png",
    cover: "canal/comentando peliculas/portada-1.png",
    views: "175 K de vistas",
    uploaded: "hace 2 semanas",
    duration: "11:48",
    category: "peliculas",
    isShort: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let videosData = [];
  let currentNav = 'home';
  let currentCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const videosGrid = document.getElementById('videosGrid');
  const shortsGrid = document.getElementById('shortsGrid');
  const shortsShelf = document.getElementById('shortsShelf');
  const emptyState = document.getElementById('emptyState');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const subscribedChannelsList = document.getElementById('subscribedChannels');
  const currentSectionTitle = document.getElementById('currentSectionTitle');

  // Search Elements
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');

  // Sidebar Elements
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const topShortsBtn = document.getElementById('topShortsBtn');

  // Category Chips
  const categoryChips = document.querySelectorAll('.chip');

  // Modal Elements
  const videoModal = document.getElementById('videoModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalVideoTitle = document.getElementById('modalVideoTitle');
  const modalChannelLogo = document.getElementById('modalChannelLogo');
  const modalChannelName = document.getElementById('modalChannelName');
  const modalVideoStats = document.getElementById('modalVideoStats');
  const playerWrapper = document.getElementById('playerWrapper');

  // Fetch Videos and initialize app
  async function initApp() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error(`HTTP status: ${response.status}`);
      const data = await response.json();
      videosData = (data && data.videos && data.videos.length > 0) ? data.videos : DEFAULT_VIDEOS;
    } catch (error) {
      console.warn('Fetch no disponible (modo local file:// o error de red), usando datos de respaldo:', error);
      videosData = DEFAULT_VIDEOS;
    }
    
    renderSubscribedChannels();
    applyFiltersAndRender();
  }

  // Render Subscribed Channels in Sidebar
  function renderSubscribedChannels() {
    if (!subscribedChannelsList) return;
    
    // Extract unique channels
    const channelsMap = new Map();
    videosData.forEach(v => {
      if (v.channel && !channelsMap.has(v.channel)) {
        channelsMap.set(v.channel, {
          name: v.channel,
          logo: v.channelLogo || 'img/short.png'
        });
      }
    });

    subscribedChannelsList.innerHTML = '';
    channelsMap.forEach(channel => {
      const btn = document.createElement('button');
      btn.className = 'channel-item';
      btn.type = 'button';
      btn.innerHTML = `
        <img src="${escapeHtml(channel.logo)}" alt="${escapeHtml(channel.name)}" class="channel-item-avatar" onerror="this.src='img/short.png'">
        <span class="channel-item-name">${escapeHtml(channel.name)}</span>
      `;
      btn.addEventListener('click', () => {
        searchInput.value = channel.name;
        clearSearchBtn.hidden = false;
        searchQuery = channel.name.toLowerCase();
        currentCategory = 'all';
        updateActiveChip('all');
        applyFiltersAndRender();
        closeSidebar();
      });
      subscribedChannelsList.appendChild(btn);
    });
  }

  // Filter and Render Content
  function applyFiltersAndRender() {
    let regularVideos = videosData.filter(v => !v.isShort);
    let shortsVideos = videosData.filter(v => v.isShort);

    // Apply Search Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      regularVideos = regularVideos.filter(v => 
        v.title.toLowerCase().includes(query) || 
        v.channel.toLowerCase().includes(query) ||
        (v.category && v.category.toLowerCase().includes(query))
      );
      shortsVideos = shortsVideos.filter(v => 
        v.title.toLowerCase().includes(query) || 
        v.channel.toLowerCase().includes(query)
      );
    }

    // Apply Category Filter
    if (currentCategory !== 'all') {
      regularVideos = regularVideos.filter(v => v.category === currentCategory);
      shortsVideos = shortsVideos.filter(v => v.category === currentCategory);
    }

    // Apply Sidebar Nav Filter
    if (currentNav === 'shorts') {
      currentSectionTitle.textContent = 'Shorts';
      renderVideosGrid([]);
      renderShortsGrid(shortsVideos);
      shortsShelf.style.display = 'block';
      shortsShelf.style.marginTop = '0';
      shortsShelf.style.borderTop = 'none';
      
      const hasContent = shortsVideos.length > 0;
      emptyState.hidden = hasContent;
      return;
    }

    // Default Home View
    shortsShelf.style.marginTop = '40px';
    shortsShelf.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
    currentSectionTitle.textContent = searchQuery ? `Resultados para "${searchQuery}"` : 'Videos recomendados';

    renderVideosGrid(regularVideos);
    renderShortsGrid(shortsVideos);

    if (shortsVideos.length === 0) {
      shortsShelf.style.display = 'none';
    } else {
      shortsShelf.style.display = 'block';
    }

    const hasResults = regularVideos.length > 0 || shortsVideos.length > 0;
    emptyState.hidden = hasResults;
  }

  // Render Video Cards
  function renderVideosGrid(videos) {
    videosGrid.innerHTML = '';
    videos.forEach(video => {
      const card = document.createElement('article');
      card.className = 'video-card';
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="video-thumbnail-wrapper">
          <img src="${escapeHtml(video.cover)}" alt="${escapeHtml(video.title)}" class="video-cover-img" loading="lazy">
          ${video.video ? `<video class="video-preview-player" src="${escapeHtml(video.video)}" muted loop preload="none"></video>` : ''}
          ${video.duration ? `<span class="video-duration">${escapeHtml(video.duration)}</span>` : ''}
        </div>
        <div class="video-details">
          <img src="${escapeHtml(video.channelLogo || 'img/short.png')}" alt="${escapeHtml(video.channel)}" class="channel-avatar" onerror="this.src='img/short.png'">
          <div class="video-info">
            <h3 class="video-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</h3>
            <p class="channel-name">${escapeHtml(video.channel)}</p>
            <p class="video-meta">${escapeHtml(video.views)} • ${escapeHtml(video.uploaded)}</p>
          </div>
        </div>
      `;

      // Hover Video Preview
      const videoElement = card.querySelector('.video-preview-player');
      if (videoElement) {
        let hoverTimeout;
        card.addEventListener('mouseenter', () => {
          hoverTimeout = setTimeout(() => {
            videoElement.classList.add('playing');
            videoElement.play().catch(() => {});
          }, 200);
        });

        card.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimeout);
          videoElement.pause();
          videoElement.currentTime = 0;
          videoElement.classList.remove('playing');
        });
      }

      // Card Click -> Open Player Modal
      card.addEventListener('click', () => openVideoModal(video));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVideoModal(video);
        }
      });

      videosGrid.appendChild(card);
    });
  }

  // Render Shorts Cards
  function renderShortsGrid(shorts) {
    shortsGrid.innerHTML = '';
    shorts.forEach(short => {
      const card = document.createElement('article');
      card.className = 'short-card';
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="short-thumbnail-wrapper">
          <img src="${escapeHtml(short.cover)}" alt="${escapeHtml(short.title)}" class="short-cover-img" loading="lazy">
          <img src="img/short.png" alt="Short" class="short-badge">
        </div>
        <div class="short-details">
          <h4 class="short-title" title="${escapeHtml(short.title)}">${escapeHtml(short.title)}</h4>
          <p class="short-views">${escapeHtml(short.views)}</p>
        </div>
      `;

      card.addEventListener('click', () => openVideoModal(short));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVideoModal(short);
        }
      });

      shortsGrid.appendChild(card);
    });
  }

  // Video Player Modal
  function openVideoModal(video) {
    modalVideoTitle.textContent = video.title;
    modalChannelName.textContent = video.channel;
    modalChannelLogo.src = video.channelLogo || 'img/short.png';
    modalVideoStats.textContent = `${video.views} • ${video.uploaded}`;

    playerWrapper.innerHTML = '';
    if (video.video) {
      const videoElem = document.createElement('video');
      videoElem.src = video.video;
      videoElem.poster = video.cover;
      videoElem.controls = true;
      videoElem.autoplay = true;
      videoElem.playsInline = true;
      playerWrapper.appendChild(videoElem);
    } else {
      const imgElem = document.createElement('img');
      imgElem.src = video.cover;
      imgElem.alt = video.title;
      playerWrapper.appendChild(imgElem);
    }

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    playerWrapper.innerHTML = '';
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeVideoModal);
  modalBackdrop.addEventListener('click', closeVideoModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // Search Logic
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.hidden = searchQuery.length === 0;
    applyFiltersAndRender();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.hidden = true;
    searchInput.focus();
    applyFiltersAndRender();
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = searchInput.value;
    applyFiltersAndRender();
  });

  // Category Chips
  function updateActiveChip(category) {
    categoryChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === category);
    });
  }

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      currentCategory = chip.dataset.category || 'all';
      updateActiveChip(currentCategory);
      applyFiltersAndRender();
    });
  });

  // Reset Button
  resetFilterBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.hidden = true;
    currentCategory = 'all';
    currentNav = 'home';
    updateActiveChip('all');
    sidebarItems.forEach(item => {
      item.classList.toggle('active', item.dataset.nav === 'home');
    });
    applyFiltersAndRender();
  });

  // Sidebar Navigation & Toggle
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  menuToggle.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    }
  });

  sidebarOverlay.addEventListener('click', closeSidebar);

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const navTarget = item.dataset.nav;
      if (!navTarget) return;

      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentNav = navTarget;

      applyFiltersAndRender();
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  if (topShortsBtn) {
    topShortsBtn.addEventListener('click', () => {
      const shortsSidebarItem = document.querySelector('.sidebar-item[data-nav="shorts"]');
      if (shortsSidebarItem) shortsSidebarItem.click();
    });
  }

  // Utility to escape HTML strings safely
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on load
  initApp();
});