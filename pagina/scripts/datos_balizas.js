export function getDatosBaliza(nombre) {
    return fetch("http://127.0.0.1:85/datos/" + nombre);
}

function obtenerFechaActual() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 1); // Restar un día para obtener la fecha de ayer
    const año = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }
    let dia = fecha.getDate();
    if (dia < 10) {
        dia = "0" + dia;
    }
    return { año, mes, dia };
}

export function getDatosHoyBaliza(baliza) {
    return fetch("http://127.0.0.1:85/datosHoy/" + baliza.nombre)
        .then((response) => response.json())
        .then((data) => {
            baliza.datosHoy = data[0];

            const { año, mes, dia } = obtenerFechaActual();
            console.log("Fecha actual:", año, mes, dia);

            let nombreBaliza = baliza.nombre.toLowerCase();
            let zona;
            switch (nombreBaliza) {
                case "irun":
                case "hondarribia":
                    zona = "coast_zone";
                    break;
                case "donostia":
                case "errenteria":
                    zona = "donostialdea";
                    break;
                case "bilbao":
                    zona = "great_bilbao";
                    break;
                case "gasteiz":
                    zona = "vitoria_gasteiz";
                    break;
                default:
                    zona = "basque_country";
                    break;
            }

            const options = {
                method: "GET",
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE3MzM5ODgyMTAsImVtYWlsIjoiaWtjdG1AcGxhaWF1bmRpLm5ldCJ9.jUafbRj0bVB0-qXy3If_Xa8CAK3fja-Or7uRj7fzMFVT3HNVygv5ZaxBSxhYI2lKBz8prugwK8Dzt2a_Cr5L2X08STo1QhwfUsgKSnRrvgLj9-5k0oOOWev54EKJYQbXGXIRv7ThUd0UnmrIbkDjHPtYyigl0_q9Xjxz5NBNAathme8WbmblsjYx10Ig5FPVGxbozxvdX2um0BvefzUK5_MpCtem26u8uEfVYYnvRBWBviAG11woUrHLJIDuBifFbu8qKV9L25-pK231KkhUYGr-i_k3zul-ran0tsBg4P5Ezu0b1x_Q3RyuDCb6bO9ocbdL9ttKZkZG4gQfs8GfMw",
                },
            };

            return fetch(
                `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/${zona}/locations/${nombreBaliza}/forecast/at/${año}/${mes}/${dia}/for/${año}${mes}${dia}`,
                options
            )
                .then((response) => response.blob()) // Obtener el blob
                .then((blob) => {
                    const reader = new FileReader();
                    reader.readAsText(blob, "ISO-8859-1"); // Convertir a texto con codificación específica
                    reader.onload = () => {
                        try {
                            const json = JSON.parse(reader.result); // Intentar parsear JSON
                            baliza.forecast = json.forecastText.SPANISH; // Asignar el forecast
                        } catch (error) {
                            console.error("Error parseando JSON:", error);
                            baliza.forecast = "No se pudo convertir la respuesta en JSON.";
                        }
                    };
                    reader.onerror = () => {
                        console.error("Error al leer el blob.");
                    };
                })
                .catch((err) => console.error("Error al obtener la previsión:", err));
        })
        .catch((error) => {
            console.error("Error al obtener los datos de hoy para la baliza", baliza.nombre, error);
        });
}
