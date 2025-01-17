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

// Funciones para actualizar la lista de balizas
function actualizarListaBalizas() {
    const lista = document.getElementById('balizas-seleccionadas');
    lista.innerHTML = '';
    balizasSeleccionadas.forEach(baliza => {
        const li = document.createElement('li');
        li.textContent = baliza.nombre;
        const button = document.createElement('button');
        button.textContent = 'Eliminar';
        button.classList.add('remove-baliza');
        button.addEventListener('click', () => eliminarBaliza(baliza.nombre));
        li.appendChild(button);
        lista.appendChild(li);
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

            marker.bindPopup(`<strong>${baliza.nombre}</strong><br>`);

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

