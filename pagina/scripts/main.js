import { iconoCielo, colorCielo, iconoParametro } from "./utils.js";
import { getDatosHoyBaliza } from "./datos_balizas.js";
import { setLanguage, applyTranslations, translate } from './idioma.js';


// -------------------------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------------ GESTION DE IDIOMAS ------------------------------------------------------------- //
// -------------------------------------------------------------------------------------------------------------------------------------- //

// Al iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();

    // Manejadores para los botones de idioma
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', () => {
            setLanguage(button.dataset.lang);
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            actualizarListaBalizas();
            actualizarGrafico();
        });
    });

    // Establecer el botón activo según el idioma seleccionado
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    document.querySelector(`.lang-btn[data-lang="${selectedLanguage}"]`).classList.add('active');
});

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

// Función para hacer mayuscula la primera letra de un string
function mayuscula(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Funciones para actualizar la lista de balizas
function actualizarListaBalizas() {
    const lista = document.getElementById("balizas-seleccionadas");
    lista.innerHTML = ""; // Limpia la lista antes de actualizar

    if (balizasSeleccionadas.size === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = translate("No hay balizas seleccionadas.");
        lista.appendChild(mensaje);
        return;
    }

    balizasSeleccionadas.forEach((baliza) => {
        getDatosHoyBaliza(baliza).then(() => {
            // Verificar si la tarjeta ya existe
            if (document.getElementById(baliza.nombre)) {
                return;
            }

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
                    <div id="cielo">${translate(mayuscula(baliza.datosHoy.cielo))}</div>
                    <div id="linea-divisoria"></div>
                </div>
                <div id="fecha_dato">
                    ${translate("Recogido el")}: ${baliza.datosHoy.timestamp}
                </div>
            `;

            // Añadir parámetros guardados en localStorage
            const parametrosGuardados = JSON.parse(localStorage.getItem(`parametros_${baliza.nombre}`)) || [];
            parametrosGuardados.forEach(parametro => {
                const parametroValue = baliza.datosHoy[parametro];
                const divParametro = iconoParametro(parametro, parametroValue);
                card.querySelector('.baliza-content').innerHTML += divParametro;
            });

            // Mostrar la línea divisoria si hay parámetros añadidos
            if (card.querySelectorAll('.drag-param').length > 0) {
                card.querySelector('#linea-divisoria').style.display = 'block';
            }

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
                    balizasSeleccionadas.forEach((b) => {
                        if (b.nombre === baliza.nombre) {
                            balizasSeleccionadas.delete(b);
                        }
                    });
                    localStorage.removeItem(`parametros_${baliza.nombre}`);
                    if (balizasSeleccionadas.size === 0) {
                        localStorage.removeItem('balizasSeleccionadas');
                    } else {
                        localStorage.setItem('balizasSeleccionadas', JSON.stringify(Array.from(balizasSeleccionadas)));
                    }
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

                    card.find('#linea-divisoria').css('display', 'block');

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
                const $card = $param.closest('.baliza-card'); // Obtenemos la tarjeta contenedora
                const balizaNombre = $card.attr('id');
                const parametro = $param.attr('id');

                // Eliminar el parámetro del localStorage
                let parametrosGuardados = JSON.parse(localStorage.getItem(`parametros_${balizaNombre}`)) || [];
                parametrosGuardados = parametrosGuardados.filter(p => p !== parametro);
                localStorage.setItem(`parametros_${balizaNombre}`, JSON.stringify(parametrosGuardados));

                $param.remove(); // Eliminar el parámetro del DOM

                if ($card.find('.drag-param').length === 0) {
                    $card.find('#linea-divisoria').css('display', 'none');
                }
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
// Función para validar fechas y habilitar/deshabilitar botón
function validarFechas() {
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFinal = document.getElementById('fecha-final').value;
    const btnActualizar = document.getElementById('btn-actualizar');
    if (fechaInicio && fechaFinal) {
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFinal);
        btnActualizar.disabled = startDate > endDate;
    } else {
        btnActualizar.disabled = true;
    }
}
// Event listeners para los date inputs
document.getElementById('fecha-inicio').addEventListener('change', validarFechas);
document.getElementById('fecha-final').addEventListener('change', validarFechas);
// Función actualizada para obtener datos con filtro de fechas
function actualizarGrafico() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'flex';
    if (!myChart) {
        myChart = echarts.init(document.getElementById("grafico-datos"));
    }
    if (balizasSeleccionadas.size === 0) {
        myChart.clear();
        spinner.style.display = 'none';
        return;
    }
    const balizaActual = Array.from(balizasSeleccionadas)[currentBalizaIndex];
    document.getElementById("currentBalizaNombre").textContent = balizaActual.nombre;
    // Obtener valores de fecha
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFinal = document.getElementById('fecha-final').value;
    // Construir URL con parámetros de fecha
    let url = `http://127.0.0.1:85/datos/${balizaActual.nombre}`;
    if (fechaInicio && fechaFinal) {
        url += `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFinal}`;
    }
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(datosHistoricos => {
            const option = {
            title: {
                text: `${translate('Datos históricos')} - ${balizaActual.nombre}`,
                left: "center",
            },
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: [
                translate("Temperatura"),
                translate("Humedad"),
                translate("Velocidad Viento"),
                translate("Probabilidad de precipitacion"),
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
                data: datosHistoricos.map(d => new Date(d.timestamp).toLocaleDateString()),
            },
            yAxis: {
                type: "value",
            },
            series: [
                {
                name: translate("Temperatura"),
                type: "line",
                data: datosHistoricos.map(d => d.temperatura),
                },
                {
                name: translate("Humedad"),
                type: "line",
                data: datosHistoricos.map(d => d.humedad),
                },
                {
                name: translate("Velocidad Viento"),
                type: "line",
                data: datosHistoricos.map(d => d.velocidad_viento),
                },
                {
                name: translate("Probabilidad de precipitacion"),
                type: "line",
                data: datosHistoricos.map(d => d.probabilidad_precipitacion),
                },
            ],
            };
            myChart.setOption(option, true);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar datos. Verifica las fechas seleccionadas.');
        })
        .finally(() => {
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
