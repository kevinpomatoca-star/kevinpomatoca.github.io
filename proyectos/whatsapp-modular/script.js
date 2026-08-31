document.addEventListener('DOMContentLoaded', () => {
    const statuses = [
        { name: "Mi estado", img: "https://i.pravatar.cc/150?u=me", isMe: true },
        { name: "María", img: "https://i.pravatar.cc/150?u=maria" },
        { name: "Carlos", img: "https://i.pravatar.cc/150?u=carlos" },
        { name: "Ana", img: "https://i.pravatar.cc/150?u=ana" },
        { name: "Juan", img: "https://i.pravatar.cc/150?u=juan" },
        { name: "Elena", img: "https://i.pravatar.cc/150?u=elena" },
        { name: "Luis", img: "https://i.pravatar.cc/150?u=luis" }
    ];

    const chats = [
        { name: "María", img: "https://i.pravatar.cc/150?u=maria", time: "10:30 a.m.", msg: "¡Hola! ¿Cómo estás?", unread: 2, statusIcon: "" },
        { name: "Grupo Familia", img: "https://i.pravatar.cc/150?u=fam", time: "Ayer", msg: "Carlos: Nos vemos mañana", unread: 5, statusIcon: "" },
        { name: "Juan", img: "https://i.pravatar.cc/150?u=juan", time: "Ayer", msg: "Revisa el correo por favor", unread: 0, statusIcon: "fas fa-check-double read" },
        { name: "Ana", img: "https://i.pravatar.cc/150?u=ana", time: "Martes", msg: "Audio (0:15)", unread: 0, statusIcon: "fas fa-microphone read" },
        { name: "Carlos Trabajo", img: "https://i.pravatar.cc/150?u=carlos2", time: "Lunes", msg: "Perfecto, aprobado.", unread: 0, statusIcon: "fas fa-check-double" },
        { name: "Elena", img: "https://i.pravatar.cc/150?u=elena", time: "Lunes", msg: "Jajaja sí, total", unread: 0, statusIcon: "fas fa-check" },
        { name: "Luis", img: "https://i.pravatar.cc/150?u=luis", time: "Domingo", msg: "Ok", unread: 0, statusIcon: "fas fa-check-double read" },
        { name: "Soporte", img: "https://i.pravatar.cc/150?u=soporte", time: "15/08/23", msg: "Su ticket ha sido cerrado.", unread: 0, statusIcon: "" },
        { name: "Marta", img: "https://i.pravatar.cc/150?u=marta", time: "14/08/23", msg: "Te llamo luego", unread: 0, statusIcon: "fas fa-check-double read" },
        { name: "Pedro", img: "https://i.pravatar.cc/150?u=pedro", time: "10/08/23", msg: "¿Vamos al cine?", unread: 1, statusIcon: "" },
        { name: "Lucía", img: "https://i.pravatar.cc/150?u=lucia", time: "05/08/23", msg: "Me parece bien", unread: 0, statusIcon: "fas fa-check-double read" },
        { name: "Jorge", img: "https://i.pravatar.cc/150?u=jorge", time: "01/08/23", msg: "Enviado", unread: 0, statusIcon: "fas fa-check-double" }
    ];

    const statusStrip = document.getElementById('statusStrip');
    const chatList = document.getElementById('chatList');
    const moduleToggle = document.getElementById('moduleToggle');
    const whatsappApp = document.getElementById('whatsappApp');

    function renderStatuses() {
        statusStrip.innerHTML = '';
        statuses.forEach((s) => {
            const div = document.createElement('div');
            div.className = 'status-item';
            div.innerHTML = `
                <img src="${s.img}" class="status-avatar ${s.isMe ? 'my-status' : ''}" alt="${s.name}">
                <span class="status-name">${s.name}</span>
            `;
            statusStrip.appendChild(div);
        });
    }

    function renderChats() {
        chatList.innerHTML = '';
        chats.forEach((c, i) => {
            const row = document.createElement('article');
            row.className = 'chat-row';
            row.style.setProperty('--row-index', i);

            let statusHtml = c.statusIcon ? `<i class="chat-status ${c.statusIcon}"></i>` : '';
            let unreadHtml = c.unread > 0 ? `<div class="chat-badge">${c.unread}</div>` : '';
            let timeClass = c.unread > 0 ? 'chat-time unread' : 'chat-time';

            row.innerHTML = `
                <img src="${c.img}" class="chat-avatar" alt="${c.name}">
                <p class="chat-mini-label">${c.name}</p>
                <div class="chat-content">
                    <div class="chat-head">
                        <span class="chat-name">${c.name}</span>
                        <div class="chat-meta">
                            <span class="${timeClass}">${c.time}</span>
                            ${unreadHtml}
                        </div>
                    </div>
                    <div class="chat-preview">
                        ${statusHtml}
                        <p>${c.msg}</p>
                    </div>
                </div>
            `;
            chatList.appendChild(row);
        });
    }

    renderStatuses();
    renderChats();

    moduleToggle.addEventListener('click', () => {
        whatsappApp.classList.toggle('modular-view');
        // Toggle icon visually
        const icon = moduleToggle.querySelector('i');
        if (whatsappApp.classList.contains('modular-view')) {
            icon.classList.remove('fa-grip');
            icon.classList.add('fa-list');
        } else {
            icon.classList.remove('fa-list');
            icon.classList.add('fa-grip');
        }
    });
});
