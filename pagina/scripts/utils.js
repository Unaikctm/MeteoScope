// Función para obtener el icono del tiempo según el estado
export function iconoCielo(estado) {
    switch (estado) {
        case "cielo claro":
            return `<img src="./imagenes/sol.png" alt="Sol" width="50" height="50">`;
        case "algo de nubes":
            return `<img src="./imagenes/algo_de_nubes.png" alt="Nublado" width="50" height="50">`;
        case "nubes":
        case "muy nuboso":
        case "nubes dispersas":
            return `<img src="./imagenes/muy_nuboso.png" alt="Nubes" width="50" height="50">`;
        case "niebla":
        case "bruma":
            return `<img src="./imagenes/niebla.png" alt="Niebla" width="50" height="50">`;
        case "llovizna ligera":
        case "lluvia":
            return `<img src="./imagenes/lluvia.png" alt="Lluvia" width="50" height="50">`;

        default:
            // Por defecto, se muestra un icono de un prado
            return `<img src="./imagenes/else.png" alt="else" width="50" height="50">`;
    }
}

// Función para obtener el fondo de color del tiempo según el estado
export function colorCielo(estado) {
    switch (estado) {
        case "cielo claro":
            return "linear-gradient(0deg, rgba(252,158,121,1) 0%, rgba(254,236,153,1) 100%)";
        case "algo de nubes":
            return "linear-gradient(0deg, rgba(12,112,242,1) 0%, rgba(189,245,255,1) 100%)";
        case "nubes":
        case "muy nuboso":
        case "nubes dispersas":
            return "linear-gradient(0deg, rgba(146,186,210,1) 0%, rgba(197,226,247,1) 100%)";
        case "niebla":
        case "bruma":
            return "linear-gradient(0deg, rgba(169,169,169,1) 0%, rgba(211,211,211,1) 100%)";
        case "llovizna ligera":
        case "lluvia":
            return "linear-gradient(0deg, rgba(45,65,101,1) 0%, rgba(72,112,154,1) 100%)";

        default:
            return "linear-gradient(0deg, rgba(0,255,0,1) 0%, rgba(255,255,255,1) 100%)";
    }
}

// Función para obtener el icono del parametro
export function iconoParametro(parametro, parametroValue) {
    switch (parametro) {
        case "temperatura":
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>:
            ${parametroValue}ºC
            </div>`;
        case "humedad":
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplets"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>:
            ${parametroValue}%
            </div>`;
        case "velocidad_viento":
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wind"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>:
            ${parametroValue}km/h
            </div>`;
        case "probabilidad_precipitacion":
            return `<div class="drag-param" id="${parametro}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>:
            ${parametroValue}%
            </div>`;
        default:
            return `<div class="drag-param" id="${parametro}">Error</div>`;
    }
}
