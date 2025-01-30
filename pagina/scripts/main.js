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
                    Recogido el: ${baliza.created_at}
                </div>
            `;
            lista.appendChild(card);
        });
    });
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

                // Consigue el valor del parámetro de la baliza
                const parametroValue = baliza.datosHoy[parametro];

                const card = $(this);
                const divParametro = iconoParametro(parametro, parametroValue);

                // Verifica si el parámetro ya está visible, si no, no se añade
                if (!card.find(`#${parametro}`).length) {
                    card.append(`${divParametro}`);
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
                $param.remove(); // Eliminar el parámetro del DOM
            });
        }
    });

    $(document).on("mouseleave", ".drag-param", function () {
        const $param = $(this);
        $param.find(".x").remove();
    });
});

// -------------------------------------------------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------- MODAL ---------------------------------------------------------------- //
// -------------------------------------------------------------------------------------------------------------------------------------- //

// Obtener el modal y el botón de cierre
const modal = $("#forecastModal");
const closeBtn = $(".close");

// Función para abrir el modal con la previsión meteorológica
function abrirModal(forecast) {
    $("#forecastText").text(forecast); // Mostrar la previsión
    modal.show(); // Mostrar el modal
}

// Función para cerrar el modal
function cerrarModal() {
    modal.hide(); // Ocultar el modal
}

// Evento para cerrar el modal al hacer clic en la "X"
closeBtn.on("click", cerrarModal);

// Evento para cerrar el modal al hacer clic fuera del contenido
$(window).on("click", (event) => {
    if ($(event.target).is(modal)) {
        cerrarModal();
    }
});

// Evento para abrir el modal al hacer clic en el encabezado de la baliza
$(document).on("click", ".baliza-header", function () {
    const balizaCard = $(this).closest(".baliza-card");
    const balizaNombre = balizaCard.attr("id");
    const baliza = Array.from(balizasSeleccionadas).find(
        (b) => b.nombre === balizaNombre
    );

    if (baliza && baliza.forecast) {
        abrirModal(baliza.forecast);
    } else {
        abrirModal("No hay previsión disponible para esta baliza.");
    }
});

// Cambiar el cursor al pasar sobre el encabezado de la baliza
$(document).on("mouseover", ".baliza-header", function () {
    $(this).css("cursor", "pointer");
});

$(document).on("mouseout", ".baliza-header", function () {
    $(this).css("cursor", "default");
});

// -------------------------------------------------------------------------------------------------------------------------------------- //
// -------------------------------------------------------- GRAFICO EN ECHARTS ---------------------------------------------------------- //
// -------------------------------------------------------------------------------------------------------------------------------------- //

let currentBalizaIndex = 0;
let myChart = null;

//Coge el boton del html de actualizar gráfico
document
    .getElementById("btn-actualizar")
    .addEventListener("click", actualizarGrafico);

// Función para inicializar o actualizar el gráfico
function actualizarGrafico() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'flex';

    if (!myChart) {
        myChart = echarts.init(document.getElementById("grafico-datos"));
        console.log("Inicializado gráfico");
    }

    if (balizasSeleccionadas.size === 0) {
        myChart.clear();
        console.log("No hay balizas");
        return;
    }

    const balizaActual = Array.from(balizasSeleccionadas)[currentBalizaIndex];
    console.log(balizasSeleccionadas);
    console.log("Baliza actual:", balizaActual);
    document.getElementById("currentBalizaNombre").textContent =
        balizaActual.nombre;

    getDatosBaliza(balizaActual.nombre)
        .then((response) => response.json())
        .then((datosHistoricos) => {
            console.log("los datos comienzan", datosHistoricos);
            const option = {
                title: {
                    text: `Datos históricos - ${balizaActual.nombre}`,
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: [
                        "Temperatura",
                        "Humedad",
                        "Velocidad Viento",
                        "Probabilidad_precipitacion",
                    ],
                    top: 30,
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: datosHistoricos.map((d) =>
                        new Date(d.created_at).toLocaleDateString()
                    ),
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        name: "Temperatura",
                        type: "line",
                        data: datosHistoricos.map((d) => d.temperatura),
                    },
                    {
                        name: "Humedad",
                        type: "line",
                        data: datosHistoricos.map((d) => d.humedad),
                    },
                    {
                        name: "Velocidad Viento",
                        type: "line",
                        data: datosHistoricos.map((d) => d.velocidad_viento),
                    },
                    {
                        name: "Probabilidad_precipitacion",
                        type: "line",
                        data: datosHistoricos.map(
                            (d) => d.probabilidad_precipitacion
                        ),
                    },
                ],
            };

            myChart.setOption(option, true);
        })
        .finally(() => {
            // Ocultar el spinner de carga
            spinner.style.display = 'none';
        });
}

// Eventos para los botones de navegación
document.getElementById("prevBaliza").addEventListener("click", () => {
    if (balizasSeleccionadas.size === 0) return;
    currentBalizaIndex =
        (currentBalizaIndex - 1 + balizasSeleccionadas.size) %
        balizasSeleccionadas.size;
    actualizarGrafico();
});

document.getElementById("nextBaliza").addEventListener("click", () => {
    if (balizasSeleccionadas.size === 0) return;
    currentBalizaIndex = (currentBalizaIndex + 1) % balizasSeleccionadas.size;
    actualizarGrafico();
});
