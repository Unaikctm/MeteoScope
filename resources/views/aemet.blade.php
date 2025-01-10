<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1 id="prueba">Información meteorológica</h1>
    <script>
        const options = {method: 'GET'};

        const url = 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/' + {{$id}} + '/?api_key=' + '{{ env('API_KEY') }}';

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
            if (data.estado === 200) {
                //Es un fetch en 2 pasos, ya que aemet te entrega el json en otra pagina redirigida
                const datosUrl = data.datos;
                return fetch(datosUrl, options)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Datos reales:', data);
                        document.getElementById('prueba').innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                    });
            } else {
                throw new Error(`Error en la solicitud inicial: ${data.descripcion}`);
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.getElementById('prueba').innerHTML += '<p>Error al obtener datos.</p>';
        });
    </script>
</body>
</html>
