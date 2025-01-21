// Gestión de pestañas
document.querySelectorAll('.tab-boton').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-boton').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.contenido').forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');

        // Cerrar todos los popups activos en el mapa
        map.closePopup();
    });
});

// Inicializar mapa
const map = L.map('mapid').setView([43.0, -2.5], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Almacenar balizas seleccionadas
let balizasSeleccionadas = new Set();

// Map para asociar cada baliza con su marcador
let markers = new Map();

// Función para obtener el icono del tiempo según el estado
function iconoCielo(estado) {
    switch (estado) {
        case 'cielo claro':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
        case 'algo de nubes':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-sun"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`;
        case 'muy nuboso':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloudy"><path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"/></svg>`;
        case 'niebla':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-fog"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>`;
        case 'bruma':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-drizzle"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>`;

        // Lluvia
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain-wind"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m9.2 22 3-7"/><path d="m9 13-3 7"/><path d="m17 13-3 7"/></svg>`;
    }
}

// Funciones para actualizar la lista de balizas
function actualizarListaBalizas() {
    const lista = document.getElementById('balizas-seleccionadas');
    lista.innerHTML = '';
    balizasSeleccionadas.forEach(baliza => {
        getDatosHoyBaliza(baliza).then(() => {
            const card = document.createElement('div');
            card.className = 'baliza-card';
            card.innerHTML = `
                <div class="baliza-header">
                    <h3>${baliza.nombre}</h3>
                </div>
                <div class="baliza-content">
                    <div class="weather-info">
                        <div class="weather-icon">
                            ${iconoCielo(baliza.datosHoy.cielo)}
                        </div>
                        <div class="weather-text">
                            ${baliza.datosHoy.cielo}
                        </div>
                        <button class="remove-baliza" onclick="eliminarBaliza('${baliza.nombre}')">✕</button>
                    </div>
                </div>
            `;
            lista.appendChild(card);
        });
    });
}

// Eliminar baliza de la lista de seleccionadas
function eliminarBaliza(nombre) {
    balizasSeleccionadas.forEach(baliza => {
        if (baliza.nombre === nombre) {
            balizasSeleccionadas.delete(baliza);
            const marker = markers.get(baliza.nombre);
            if (marker) {
                marker.setIcon(L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                }));
            }
        }
    });
    actualizarListaBalizas();
}

// Cargar balizas desde la API
const url = 'http://127.0.0.1:85/balizas';
fetch(url)
    .then(response => response.json())
    .then(balizas => {
        balizas.forEach(baliza => {
            const marker = L.marker([baliza.latitud, baliza.longitud], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(map);

            markers.set(baliza.nombre, marker);

            marker.bindTooltip(`<strong>${baliza.nombre}</strong>`, {
                permanent: false,
                direction: 'top',
                offset: [0, -40]
            });

            marker.on('click', () => {
                if (balizasSeleccionadas.has(baliza)) {
                    marker.setIcon(L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    }));
                    balizasSeleccionadas.delete(baliza);
                } else {
                    marker.setIcon(L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    }));
                    balizasSeleccionadas.add(baliza);
                }
                actualizarListaBalizas();
            });
        });
    })
    .catch(error => {
        console.error('Error al cargar las balizas:', error);
        document.getElementById('mapid').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>Error al cargar las balizas. Por favor, intente más tarde.</p>
            </div>
        `;
    });

function getDatosBaliza(nombre) {
    return fetch('http://127.0.0.1:85/datos/' + nombre);
};

function getDatosHoyBaliza(baliza) {
    return fetch('http://127.0.0.1:85/datosHoy/' + baliza.nombre)
        .then(response => response.json())
        .then(data => {
            baliza.datosHoy = data[0];
            console.log(baliza);
        })
        .catch(error => {
            console.error('Error al obtener los datos de hoy para la baliza', baliza.nombre, error);
        });
};

