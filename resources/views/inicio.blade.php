<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Incluir la hoja de estilo CSS de Leaflet desde un CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"/>
    <!-- JavaScript de Leaflet desde un CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="mapid" style="height: 800px;width: 50%;float: left;"></div>
    <table id="tablaOfertas" style="float: left;margin-left:3%; width: 45%">
        <thead>
            <tr>
                <th id="numOfertas" colspan="4">Número de Ofertas: 0</th>
            </tr>
        </thead>
        <tbody>
            <!-- Aquí se insertarán las filas de la tabla dinámicamente -->
        </tbody>
    </table>
    <script>
        //Mapa en OpenStreetMap
        var map = L.map('mapid').setView([43.0, -2.5], 9);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var balizas = @json($balizas);

        // Crear marcadores para las balizas
        balizas.forEach(baliza => {
            var marker = L.marker([baliza.latitud, baliza.longitud]).addTo(map);
            marker.bindPopup(baliza.nombre);
            marker.bindTooltip(baliza.nombre, {
                permanent: true,
                direction: 'top',
                offset: L.point(0, -20)
            });
        });

    </script>

    <script>
        let predicciones = [];

        async function obtenerPredicciones() {
            try {
                const respuesta = await fetch('');
                ofertas = await respuesta.json();
            } catch (error) {
                console.error('Error al cargar las ofertas:', error);
            }
        }

        window.onload = obtenerPredicciones;
    </script>
</body>
</html>
