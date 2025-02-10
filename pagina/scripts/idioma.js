export const translations = {
    es: {
        tabs: {
            map: "Mapa",
            weather: "El tiempo",
            chart: "Gráfico",
        },
        temperature: "Temperatura",
        humidity: "Humedad",
        windSpeed: "Velocidad del viento",
        precipitation: "Precipitación",
        forecast: "Previsión Meteorológica",
        selected: "Balizas Seleccionadas",
        dateSelector: "Seleccionar fechas",
        startDate: "Fecha de inicio",
        endDate: "Fecha final",
        update: "Actualizar Gráfico",
        prev: "← Anterior",
        next: "Siguiente →",
        select: "Selecciona fechas y balizas",
    },
    en: {
        tabs: {
            map: "Map",
            weather: "Weather",
            chart: "Chart",
        },
        temperature: "Temperature",
        humidity: "Humidity",
        windSpeed: "Wind Speed",
        precipitation: "Precipitation",
        forecast: "Weather Forecast",
        selected: "Selected Stations",
        dateSelector: "Select Dates",
        startDate: "Start Date",
        endDate: "End Date",
        update: "Update Chart",
        prev: "← Previous",
        next: "Next →",
        select: "Select dates and stations",
    },
    eu: {
        tabs: {
            map: "Mapa",
            weather: "Eguraldia",
            chart: "Grafikoa",
        },
        temperature: "Tenperatura",
        humidity: "Hezetasuna",
        windSpeed: "Haizearen Abiadura",
        precipitation: "Prezipitazioa",
        forecast: "Eguraldi Aurreikuspena",
        selected: "Hautatutako Balizak",
        dateSelector: "Hautatu Datak",
        startDate: "Hasierako Data",
        endDate: "Amaierako Data",
        update: "Eguneratu Grafikoa",
        prev: "← Aurrekoa",
        next: "Hurrengoa →",
        select: "Hautatu datak eta balizak",
    },
};

export function getCurrentLanguage() {
    return (
        localStorage.getItem("selectedLanguage") ||
        navigator.language.split("-")[0] ||
        "es"
    );
}

export function setLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang);
    applyTranslations();
}

export function applyTranslations() {
    const lang = getCurrentLanguage();
    const t = translations[lang] || translations.es;

    // Actualizar textos estáticos
    document.querySelectorAll("[data-idioma]").forEach((el) => {
        const key = el.dataset.idioma;
        if (t[key]) el.textContent = t[key];
    });

    // Actualizar textos dinámicos
    document.querySelectorAll("[data-idioma-tab]").forEach((button) => {
        const tabKey = button.dataset.idiomaTab;
        button.textContent = t.tabs[tabKey];
    });
}

// Función para traducir textos
export function translate(text) {
    const translations = {
        "No hay balizas seleccionadas.": {
            "es": "No hay balizas seleccionadas.",
            "en": "No beacons selected.",
            "eu": "Ez da hautatutako balizarik.",
        },
        "Recogido el": {
            "es": "Recogido el",
            "en": "Collected on",
            "eu": "Jasota",
        },
        "Cielo claro": {
            "es": "Cielo claro",
            "en": "Clear sky",
            "eu": "Zeru garbia",
        },
        "Algo de nubes": {
            "es": "Algo de nubes",
            "en": "Few clouds",
            "eu": "Hodei batzuk",
        },
        "Nubes": {
            "es": "Nubes",
            "en": "Clouds",
            "eu": "Hodeiak",
        },
        "Muy nuboso": {
            "es": "Muy nuboso",
            "en": "Very cloudy",
            "eu": "Oso hodeitsua",
        },
        "Nubes dispersas": {
            "es": "Nubes dispersas",
            "en": "Scattered clouds",
            "eu": "Hodei sakabanatuak",
        },
        "Niebla": {
            "es": "Niebla",
            "en": "Fog",
            "eu": "Ilunpea",
        },
        "Bruma": {
            "es": "Bruma",
            "en": "Mist",
            "eu": "Lainoak",
        },
        "Llovizna ligera": {
            "es": "Llovizna ligera",
            "en": "Light drizzle",
            "eu": "Txirimiri arina",
        },
        "Lluvia": {
            "es": "Lluvia",
            "en": "Rain",
            "eu": "Euria",
        },
        "Datos históricos": {
            "es": "Datos históricos",
            "en": "Historical data",
            "eu": "Datu historikoak",
        },
        "Temperatura": {
            "es": "Temperatura",
            "en": "Temperature",
            "eu": "Tenperatura",
        },
        "Humedad": {
            "es": "Humedad",
            "en": "Humidity",
            "eu": "Hezetasuna",
        },
        "Velocidad Viento": {
            "es": "Velocidad del viento",
            "en": "Wind Speed",
            "eu": "Haizearen Abiadura",
        },
        "Probabilidad de precipitacion": {
            "es": "Probabilidad de precipitación",
            "en": "Precipitation Probability",
            "eu": "Prezipitazioaren Probabilitatea",
        },
    };

    const lang = localStorage.getItem('selectedLanguage') || 'es'; // Obtener el idioma actual
    return translations[text] ? translations[text][lang] : text;
}
