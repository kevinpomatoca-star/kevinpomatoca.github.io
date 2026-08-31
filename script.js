document.addEventListener('DOMContentLoaded', () => {
    const fallbackData = {
        projects: [
            {
                id: 'buck-pid-freertos',
                title: 'Controlador Digital PID para Convertidor Buck con FreeRTOS y ESP32-C3',
                description: 'Implementación de un controlador digital de voltaje PID discreto multihilo sobre FreeRTOS, con telemetría en tiempo real mediante pantalla OLED y regulación dinámica de ciclo de trabajo PWM.',
                icon: 'fa-solid fa-bolt',
                gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                tags: ['ESP32-C3', 'FreeRTOS', 'Electrónica de Potencia', 'Control Digital', 'C++'],
                url: '#'
            },
            {
                id: 'incubacion-rpi',
                title: 'Sistema Embebido de Incubación Automatizada Basado en Raspberry Pi',
                description: 'Control multivariable de temperatura, humedad y concentración de CO2 utilizando una máquina de estados finitos (FSM) de 6 estados, sensores de alta precisión (SCD41, SHT31-D) y lazos de control PID.',
                icon: 'fa-solid fa-microchip',
                gradient: 'linear-gradient(135deg, #059669, #10b981)',
                tags: ['Raspberry Pi 5', 'FSM', 'Sensores I2C', 'Automatización', 'Python'],
                url: '#'
            },
            {
                id: 'control-motor-pic',
                title: 'Control Digital de Velocidad para Motor DC con Arquitectura Distribuida PIC',
                description: 'Sistema de lazo cerrado con encoder óptico utilizando un PIC16F877A maestro para el algoritmo PID y PICs esclavos para modulación de potencia/dimmer y multiplexación de displays de 7 segmentos. Documentado bajo formato IEEE.',
                icon: 'fa-solid fa-gauge-high',
                gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                tags: ['PIC16F877A', 'MPLAB X / XC8', 'Control PID', 'IEEE'],
                url: '#'
            },
            {
                id: 'datalogger-iot',
                title: 'Datalogger IoT con Respaldo Offline y Sincronización en la Nube',
                description: 'Nodo de monitoreo de variables ambientales con RTC de alta precisión, almacenamiento en memoria EEPROM externa para tolerancia a fallos de red, sincronización automática con Firebase RTDB y alertas por Telegram.',
                icon: 'fa-solid fa-cloud-arrow-up',
                gradient: 'linear-gradient(135deg, #ea580c, #f97316)',
                tags: ['IoT', 'Firebase', 'ESP32', 'EEPROM', 'Telegram API'],
                url: '#'
            },
            {
                id: 'cartografia-redes',
                title: 'Extracción y Cartografía Geoespacial de Redes de Distribución Eléctrica',
                description: 'Script automatizado en Python para web scraping, limpieza de datos geoespaciales y visualización interactiva de infraestructura de distribución eléctrica mediante Folium y Pandas.',
                icon: 'fa-solid fa-map-location-dot',
                gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                tags: ['Python', 'Web Scraping', 'GIS / Folium', 'Pandas'],
                url: '#'
            }
        ],
        proyectos_web: [
            {
                title: 'Clon T',
                description: 'Prototipo móvil para consultar saldo, paquetes y promociones de un servicio telefónico.',
                image: 'IMG/clon-t.png',
                url: 'proyectos/Clon T/index.html',
                tags: ['HTML', 'CSS', 'JavaScript']
            },
            {
                title: 'Clon Youtube',
                description: 'Interfaz de reproducción y exploración de videos con búsqueda, filtros, Shorts y modal.',
                image: 'IMG/clon-youtube.png',
                url: 'proyectos/Clon Youtube/index.html',
                tags: ['UI', 'Filtros', 'Responsive']
            },
            {
                title: 'Tablero de Proyectos',
                description: 'Tablero Kanban para organizar tareas, prioridades, actividad y progreso de proyectos.',
                image: 'IMG/tablero-proyectos.png',
                url: 'proyectos/Tablero de Proyectos/index.html',
                tags: ['Kanban', 'Drag & Drop', 'LocalStorage']
            },
            {
                title: 'WhatsApp Modular',
                description: 'Clon de WhatsApp con vista modular y modo listado dinámico, construido con HTML, CSS y JS puro.',
                image: 'IMG/clon-whatsapp.jpg',
                url: 'proyectos/whatsapp-modular/index.html',
                tags: ['CSS Grid', 'Animaciones', 'UI Móvil']
            }
        ]
    };

    const projectsContainer = document.getElementById('projectsContainer');
    const webProjectsContainer = document.getElementById('webProjectsContainer');
    const menuButton = document.getElementById('menuButton');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    const themeTransition = document.getElementById('themeTransition');
    const root = document.documentElement;
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateThemeToggle() {
        const isLightMode = root.dataset.theme === 'light';
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        const label = themeToggle ? themeToggle.querySelector('span') : null;

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isLightMode));
            themeToggle.setAttribute('aria-label', isLightMode ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
        }
        if (icon) {
            icon.className = isLightMode ? 'fas fa-moon' : 'fas fa-sun';
        }
        if (label) {
            label.textContent = isLightMode ? 'Modo oscuro' : 'Modo claro';
        }
    }

    function getThemeColor(theme) {
        return theme === 'light' ? '#f8fafc' : '#0b1120';
    }

    function animateThemeChange() {
        if (!themeToggle || !themeTransition || themeTransition.classList.contains('is-expanding') || themeTransition.classList.contains('is-contracting')) {
            return;
        }

        const buttonBounds = themeToggle.getBoundingClientRect();
        const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
        const transitionX = buttonBounds.left + buttonBounds.width / 2;
        const transitionY = buttonBounds.top + buttonBounds.height / 2;

        themeTransition.style.setProperty('--theme-x', `${transitionX}px`);
        themeTransition.style.setProperty('--theme-y', `${transitionY}px`);
        themeTransition.style.setProperty('--transition-bg', getThemeColor(nextTheme));
        themeToggle.disabled = true;

        // 1. Expandir la esfera para esconder el contenido
        themeTransition.classList.add('is-expanding');

        themeTransition.addEventListener('animationend', function expandHandler() {
            themeTransition.removeEventListener('animationend', expandHandler);
            
            // 2. Cambiar el tema de fondo mientras está escondido
            root.dataset.theme = nextTheme;
            localStorage.setItem('portfolio-theme', nextTheme);
            updateThemeToggle();

            // Animación de aparición de contenido nuevo
            document.body.classList.remove('theme-content-enter');
            void document.body.offsetWidth;
            document.body.classList.add('theme-content-enter');

            // 3. Contraer la esfera para mostrar el contenido
            themeTransition.classList.remove('is-expanding');
            themeTransition.classList.add('is-contracting');

            themeTransition.addEventListener('animationend', function contractHandler() {
                themeTransition.removeEventListener('animationend', contractHandler);
                themeTransition.classList.remove('is-contracting');
                document.body.classList.remove('theme-content-enter');
                themeToggle.disabled = false;
            });
        });
    }

    if (themeToggle && themeTransition) {
        updateThemeToggle();
        themeToggle.addEventListener('click', animateThemeChange);
    }

    function renderProjects(data) {
        const flipbookElement = document.getElementById('projectsFlipbook');
        if (!flipbookElement) return;
        flipbookElement.innerHTML = '';
        const projects = (data && data.projects && data.projects.length > 0) ? data.projects : fallbackData.projects;

        // Portada
        const cover = document.createElement('div');
        cover.className = 'page page-cover';
        cover.setAttribute('data-density', 'hard');
        cover.innerHTML = `<div class="page-wrapper" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center;">
            <h2>Proyectos<br>Hardware e IoT</h2><p>Desliza para explorar</p>
        </div>`;
        flipbookElement.appendChild(cover);

        // Reverso de la portada (hoja en blanco)
        const insideCover = document.createElement('div');
        insideCover.className = 'page';
        insideCover.innerHTML = `<div class="page-wrapper" style="background-color: var(--card); height:100%;"></div>`;
        flipbookElement.appendChild(insideCover);

        // Páginas de proyectos
        projects.forEach((project, index) => {
            const page = document.createElement('div');
            page.className = 'page';
            const headerStyle = project.gradient ? `background: ${project.gradient};` : 'background: var(--card);';
            const iconClass = project.icon || 'fa-solid fa-microchip';

            page.innerHTML = `
                <div class="page-wrapper" style="display: flex; flex-direction: column; height: 100%;">
                    <div class="page-header" style="${headerStyle}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="page-text">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags" style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${project.tags.map((tag) => `<span class="tag" style="font-size:0.75rem; padding:4px 8px;">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="page-footer">Proyecto ${index + 1} de ${projects.length}</div>
                </div>
            `;
            flipbookElement.appendChild(page);
        });

        // Página de Fin
        const finPage = document.createElement('div');
        finPage.className = 'page';
        finPage.innerHTML = `<div class="page-wrapper" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center;">
            <h2>Fin</h2><p>Gracias por explorar</p>
        </div>`;
        flipbookElement.appendChild(finPage);

        // Balance de páginas: Asegurar que las páginas internas sean pares para que la contraportada caiga a la izquierda
        // Páginas internas = Reverso (1) + Proyectos (N) + Fin (1) = N + 2
        // Si N no es par, N+2 es impar, por lo que agregamos una hoja transparente
        if (projects.length % 2 !== 0) {
            const invisiblePage = document.createElement('div');
            invisiblePage.className = 'page';
            invisiblePage.innerHTML = `<div class="page-wrapper" style="background-color: var(--card); height:100%;"></div>`;
            flipbookElement.appendChild(invisiblePage);
        }

        // Contraportada (Tapa dura final)
        const backCover = document.createElement('div');
        backCover.className = 'page page-cover';
        backCover.setAttribute('data-density', 'hard');
        backCover.innerHTML = `<div class="page-wrapper" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center;">
            <i class="fas fa-microchip" style="font-size: 3rem; opacity: 0.5;"></i>
        </div>`;
        flipbookElement.appendChild(backCover);

        // Inicializar St.PageFlip
        if (typeof St !== 'undefined' && St.PageFlip) {
            const pageFlip = new St.PageFlip(flipbookElement, {
                width: 450,
                height: 600,
                size: "fixed",
                minWidth: 315,
                maxWidth: 1000,
                minHeight: 420,
                maxHeight: 1350,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: true
            });

            pageFlip.loadFromHTML(flipbookElement.querySelectorAll('.page'));

            document.getElementById('prevPage').addEventListener('click', () => {
                pageFlip.flipPrev();
            });
            document.getElementById('nextPage').addEventListener('click', () => {
                pageFlip.flipNext();
            });
        }
    }

    function renderWebProjects(data) {
        if (!webProjectsContainer) return;
        webProjectsContainer.innerHTML = '';
        if (!data || !data.proyectos_web) return;

        data.proyectos_web.forEach((project) => {
            const card = document.createElement('a');
            card.classList.add('project-card');
            card.href = project.url || '#';

            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            webProjectsContainer.appendChild(card);
        });
    }

    function loadPortfolioData() {
        fetch('./data.json?v=' + new Date().getTime())
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar data.json');
                }
                return response.json();
            })
            .then((data) => {
                renderProjects(data);
                renderWebProjects(data);
            })
            .catch(() => {
                renderProjects(fallbackData);
                renderWebProjects(fallbackData);
            });
    }

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    function updateActiveNavLink() {
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');

            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
    loadPortfolioData();

    // Generar fondo de arcoíris para el Modo Claro (Light Mode)
    const lightBg = document.getElementById('lightBackground');
    if (lightBg) {
        const purple = 'rgb(232, 121, 249)';
        const blue = 'rgb(96, 165, 250)';
        const green = 'rgb(94, 234, 212)';
        const colorsets = [
            [purple, blue, green],
            [purple, green, blue],
            [green, purple, blue],
            [green, blue, purple],
            [blue, green, purple],
            [blue, purple, green]
        ];
        const length = 25;
        const animTime = 56.25;

        for (let i = 1; i <= length; i++) {
            const rb = document.createElement('div');
            rb.className = 'rainbow';

            const r = Math.floor(Math.random() * 6);
            const c = colorsets[r];

            const shadow = `-130px 0 80px 40px white, -50px 0 50px 25px ${c[0]}, 0 0 50px 25px ${c[1]}, 50px 0 50px 25px ${c[2]}, 130px 0 80px 40px white`;
            const duration = animTime - (animTime / length / 2 * i);
            const delay = -(i / length * animTime);

            rb.style.boxShadow = shadow;
            rb.style.animation = `slideRainbow ${duration}s linear infinite`;
            rb.style.animationDelay = `${delay}s`;

            // Insertar antes del h-glow y v-glow
            lightBg.insertBefore(rb, lightBg.firstChild);
        }
    }
});
