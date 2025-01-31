export function getDatosBaliza(nombre) {
    return fetch("http://127.0.0.1:85/datos/" + nombre);
}

export function getDatosHoyBaliza(baliza) {
    return fetch("http://127.0.0.1:85/datosHoy/" + baliza.nombre)
        .then((response) => response.json())
        .then((data) => {
            // Añade los datos actuales a la baliza
            baliza.datosHoy = data[0];

            //Consigue el año, mes y día de la fecha actual y dividelo en variables
            const fecha = new Date();
            const año = fecha.getFullYear();
            let mes = fecha.getMonth() + 1;
            if (mes < 10) {
                mes = "0" + mes;
            }
            let dia = fecha.getDay() + 1;
            if (dia < 10) {
                dia = "0" + dia;
            }

            // Llamada a euskalmet para obtener la previsión meteorológica, el endpoint cambia según la baliza
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

            // Obtener la previsión meteorológica de la baliza mediante euskalmet
            return fetch(
                `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/${zona}/locations/${nombreBaliza}/forecast/at/${año}/${mes}/${dia}/for/${año}${mes}${dia}`,
                options
            )
                .then((response) => response.json())
                .then((data) => {
                    baliza.forecast = data.forecastText.SPANISH;
                    console.log(baliza);
                })
                .catch((err) => console.error(err));
        })
        .catch((error) => {
            console.error(
                "Error al obtener los datos de hoy para la baliza",
                baliza.nombre,
                error
            );
        });
}
