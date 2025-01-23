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
            return `<img src="./imagenes/cielo_claro.png" alt="Sol" width="50" height="50">`;
        case 'algo de nubes':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-sun"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`;
        case 'muy nuboso':
        case 'nubes dispersas':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloudy"><path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"/></svg>`;
        case 'niebla':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-fog"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>`;
        case 'bruma':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-drizzle"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>`;
        case 'llovizna ligera':
        case 'lluvia':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain-wind"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m9.2 22 3-7"/><path d="m9 13-3 7"/><path d="m17 13-3 7"/></svg>`;

        default:
            // Por defecto, se muestra un icono de un prado
            return `<img src="./imagenes/prado.png" alt="Prado" width="50" height="50">`;
    }
}

// Función para obtener el fondo de color del tiempo según el estado
function colorCielo(estado) {
    switch (estado) {
        case 'cielo claro':
            return 'linear-gradient(0deg, rgba(252,158,121,1) 0%, rgba(254,236,153,1) 100%)';
        case 'algo de nubes':
            return 'linear-gradient(0deg, rgba(12,112,242,1) 0%, rgba(189,245,255,1) 100%)';
        case 'muy nuboso':
        case 'nubes dispersas':
            return 'linear-gradient(0deg, rgba(146,186,210,1) 0%, rgba(197,226,247,1) 100%)';
        case 'niebla':
            return 'linear-gradient(0deg, rgba(169,169,169,1) 0%, rgba(211,211,211,1) 100%)';
        case 'bruma':
            return 'linear-gradient(0deg, rgba(147,147,165,1) 0%, rgba(196,189,201,1) 100%)';
        case 'llovizna ligera':
        case 'lluvia':
            return 'linear-gradient(0deg, rgba(45,65,101,1) 0%, rgba(72,112,154,1) 100%)';

        default:
            return 'linear-gradient(0deg, rgba(0,255,0,1) 0%, rgba(255,255,255,1) 100%)';
    }
}

// Funciones para actualizar la lista de balizas
function actualizarListaBalizas() {
    const lista = document.getElementById('balizas-seleccionadas');
    lista.innerHTML = ''; // Limpia la lista antes de actualizar
    balizasSeleccionadas.forEach(baliza => {
        getDatosHoyBaliza(baliza).then(() => {
            const card = document.createElement('div');
            card.className = 'baliza-card'; // Clases para diseño responsivo
            card.id = baliza.nombre;
            card.style.background = colorCielo(baliza.datosHoy.cielo);
            card.innerHTML = `
                <div class="baliza-header">
                    <h3>${baliza.nombre}</h3>
                </div>
                <div class="baliza-content">
                    <div>${iconoCielo(baliza.datosHoy.cielo)}</div>
                    <div>${baliza.datosHoy.cielo}</div>
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
                    if (!balizasSeleccionadas.has(baliza)){
                        balizasSeleccionadas.add(baliza);
                    }
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
        })
        .catch(error => {
            console.error('Error al obtener los datos de hoy para la baliza', baliza.nombre, error);
        });
};

// Función para obtener el icono del parametro
function iconoParametro(parametro, parametroValue) {
    switch (parametro) {
        case 'temperatura':
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>:
            ${parametroValue}ºC
            </div>`;
        case 'humedad':
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplets"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>:
            ${parametroValue}%
            </div>`;
        case 'velocidad_viento':
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wind"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>:
            ${parametroValue}km/h
            </div>`;
        case 'probabilidad_precipitacion':
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>:
            ${parametroValue}%
            </div>`;
        default:
            return `<div class="drag-param" id="${parametro}">Error</div>`;
    }
}

// Drag and drop
$(document).ready(function() {
    $(".parameter").draggable({
        helper: "clone", // Clona el elemento arrastrado
        revert: "invalid" // Devuelve el elemento si no se suelta en un contenedor válido
    });

    $(".balizas-contenedor").on("mouseenter", ".baliza-card", function () {
        $(this).droppable({
            accept: ".parameter", // Solo acepta elementos con clase 'parameter'
            drop: function (event, ui) {
                // Cojo el id del parámetro
                const parametro = ui.draggable.attr('id');

                // Consigue la baliza a la que pertenece la tarjeta de la lista balizasSeleccionadas
                const baliza = Array.from(balizasSeleccionadas).find(baliza => baliza.nombre === $(this).attr('id'));

                // Consigue el valor del parámetro de la baliza
                const parametroValue = baliza.datosHoy[parametro];

                const card = $(this);
                const divParametro = iconoParametro(parametro, parametroValue);

                // Verifica si el parámetro ya está visible, si no, no se añade
                if (!card.find(`#${parametro}`).length) {
                    card.append(`${divParametro}`);

                    $(".drag-param").draggable({
                        helper: "clone", // Clona el elemento arrastrado
                        revert: "invalid" // Devuelve el elemento si no se suelta en un contenedor válido
                    });
                }
            }
        });
    });


    //Haz que se elimine el parametro de la card al hacer drag hacia el parameters-container
    $(".parameters-container").droppable({
        accept: ".drag-param",
        drop: function (event, ui) {
            ui.draggable.remove();
        }
    });
});
