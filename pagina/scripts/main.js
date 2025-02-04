import { iconoCielo, colorCielo, iconoParametro } from "./utils.js";
import { getDatosBaliza, getDatosHoyBaliza } from "./datos_balizas.js";

// -------------------------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------ GESTION DE PESTAÑAS ----------------------------------------------------------- //
// -------------------------------------------------------------------------------------------------------------------------------------- //

document.querySelectorAll(".tab-boton").forEach((button) => {
    button.addEventListener("click", () => {
        document
            .querySelectorAll(".tab-boton")
            .forEach((btn) => btn.classList.remove("active"));
        document
            .querySelectorAll(".contenido")
            .forEach((content) => content.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");

        // Cerrar todos los popups activos en el mapa
        map.closePopup();

        // Si la pestaña activa es el gráfico y hay balizas seleccionadas
        if (button.dataset.tab === "grafico" && balizasSeleccionadas.size > 0) {
            currentBalizaIndex = 0; // Reiniciar índice
            actualizarGrafico(); // Actualizar gráfico
        }
    });
});

// -------------------------------------------------------------------------------------------------------------------------------------- //
// -------------------------------------------------- CARGA DE MAPA Y BALIZAS ----------------------------------------------------------- //
// -------------------------------------------------------------------------------------------------------------------------------------- //

// Inicializar mapa
const map = L.map("mapid").setView([43.0, -2.5], 9);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Almacenar balizas seleccionadas
let balizasSeleccionadas = new Set();

// Map para asociar cada baliza con su marcador
let markers = new Map();

// Funciones para actualizar la lista de balizas
function actualizarListaBalizas() {
    const lista = document.getElementById("balizas-seleccionadas");
    lista.innerHTML = ""; // Limpia la lista antes de actualizar

    if (balizasSeleccionadas.size === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay balizas seleccionadas.";
        lista.appendChild(mensaje);
        return;
    }

    balizasSeleccionadas.forEach((baliza) => {
        getDatosHoyBaliza(baliza).then(() => {
            const card = document.createElement("div");
            card.className = "baliza-card"; // Clases para diseño responsivo
            card.id = baliza.nombre;
            card.style.background = colorCielo(baliza.datosHoy.cielo);
            card.innerHTML = `
                <div class="baliza-header">
                    <h3 title="baliza">${baliza.nombre}</h3>
                </div>
                <div class="baliza-content">
                    <div>${iconoCielo(baliza.datosHoy.cielo)}</div>
                    <div>${baliza.datosHoy.cielo}</div>
                </div>
                <div id="fecha_dato">
                    Recogido el: ${baliza.datosHoy.timestamp}
                </div>
            `;

            // Añadir parámetros guardados en localStorage
            const parametrosGuardados = JSON.parse(localStorage.getItem(`parametros_${baliza.nombre}`)) || [];
            parametrosGuardados.forEach(parametro => {
                const parametroValue = baliza.datosHoy[parametro];
                const divParametro = iconoParametro(parametro, parametroValue);
                card.querySelector('.baliza-content').innerHTML += divParametro;
            });

            lista.appendChild(card);
        });
    });

    // Guardar balizas seleccionadas en localStorage
    localStorage.setItem('balizasSeleccionadas', JSON.stringify(Array.from(balizasSeleccionadas)));
}

// Cargar balizas desde la API
const url = "http://127.0.0.1:85/balizas";
fetch(url)
    .then((response) => response.json())
    .then((balizas) => {
        balizas.forEach((baliza) => {
            const marker = L.marker([baliza.latitud, baliza.longitud], {
                icon: L.icon({
                    iconUrl:
                        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                }),
            }).addTo(map);

            markers.set(baliza.nombre, marker);

            marker.bindTooltip(`<strong>${baliza.nombre}</strong>`, {
                permanent: false,
                direction: "top",
                offset: [0, -40],
            });

            marker.on("click", () => {
                if (balizasSeleccionadas.has(baliza)) {
                    marker.setIcon(
                        L.icon({
                            iconUrl:
                                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                        })
                    );
                    balizasSeleccionadas.delete(baliza);
                    localStorage.removeItem(`parametros_${baliza.nombre}`);
                } else {
                    marker.setIcon(
                        L.icon({
                            iconUrl:
                                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                        })
                    );
                    if (!balizasSeleccionadas.has(baliza)) {
                        balizasSeleccionadas.add(baliza);
                    }
                }
                actualizarListaBalizas();
            });
        });

        // Restaurar balizas seleccionadas desde localStorage
        const balizasGuardadas = JSON.parse(localStorage.getItem('balizasSeleccionadas'));
        if (balizasGuardadas) {
            balizasGuardadas.forEach((balizaGuardada) => {
                const baliza = balizas.find(b => b.nombre === balizaGuardada.nombre);
                if (baliza) {
                    balizasSeleccionadas.add(baliza);
                    markers.get(baliza.nombre).setIcon(
                        L.icon({
                            iconUrl:
                                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                        })
                    );
                }
            });
            actualizarListaBalizas();
        }
    })
    .catch((error) => {
        console.error("Error al cargar las balizas:", error);
        document.getElementById("mapid").innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>Error al cargar las balizas. Por favor, intente más tarde.</p>
            </div>
        `;
    });

// -------------------------------------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------- DRAG N DROP ---------------------------------------------------------------- //
// -------------------------------------------------------------------------------------------------------------------------------------- //

$(document).ready(function () {
    $(".parameter").draggable({
        helper: "clone", // Clona el elemento arrastrado
        revert: "invalid", // Devuelve el elemento si no se suelta en un contenedor válido
    });

    $(".balizas-contenedor").on("mouseenter", ".baliza-card", function () {
        $(this).droppable({
            accept: ".parameter", // Solo acepta elementos con clase 'parameter'
            drop: function (event, ui) {
                // Cojo el id del parámetro
                const parametro = ui.draggable.attr("id");

                // Consigue la baliza a la que pertenece la tarjeta de la lista balizasSeleccionadas
                const baliza = Array.from(balizasSeleccionadas).find(
                    (baliza) => baliza.nombre === $(this).attr("id")
                );
                console.log(baliza);

                // Consigue el valor del parámetro de la baliza
                const parametroValue = baliza.datosHoy[parametro];

                const card = $(this);
                const divParametro = iconoParametro(parametro, parametroValue);

                // Verifica si el parámetro ya está visible, si no, no se añade
                if (!card.find(`#${parametro}`).length) {
                    card.append(`${divParametro}`);

                    // Guardar el parámetro en localStorage
                    let parametrosGuardados = JSON.parse(localStorage.getItem(`parametros_${baliza.nombre}`)) || [];
                    parametrosGuardados.push(parametro);
                    localStorage.setItem(`parametros_${baliza.nombre}`, JSON.stringify(parametrosGuardados));
                }
            },
        });
    });
    // Hover en parámetros añadidos con drag and drop
    $(document).on("mouseenter", ".drag-param", function () {
        const $param = $(this);

        // Añadir clase de estilo y botón de eliminación
        if (!$param.find(".x").length) {
            $param.append(`<button class="x">✖</button>`);

            // Listener para el botón de eliminación
            $param.find(".x").on("click", function () {
                const balizaNombre = $param.closest('.baliza-card').attr('id');
                const parametro = $param.attr('id');

                // Eliminar el parámetro del localStorage
                let parametrosGuardados = JSON.parse(localStorage.getItem(`parametros_${balizaNombre}`)) || [];
                parametrosGuardados = parametrosGuardados.filter(p => p !== parametro);
                localStorage.setItem(`parametros_${balizaNombre}`, JSON.stringify(parametrosGuardados));

                $param.remove(); // Eliminar el parámetro del DOM
            });
        }
    });

    $(document).on("mouseleave", ".drag-param", function () {
        const $param = $(this);
        $param.find(".x").remove();
    });
});
