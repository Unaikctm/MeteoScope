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
            .then(response => response.json()
                .then(data => {
                    const urlDatos = data.datos;
                    document.write(urlDatos);
                    fetch(urlDatos, options)
                        .then(response => response.json()
                            .then(data => {
                                document.getElementById('prueba').innerHTML = data;
                            })
                        )
                        .catch(err => console.error(err));
                })
            )
            .then(response => console.log(response))
            .catch(err => console.error(err));

        document.getElementById('prueba').innerHTML = 'Información meteorológica para ' + {{$id}}
    </script>
</body>
</html>
