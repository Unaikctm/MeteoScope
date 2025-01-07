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
        var map = L.map('mapid').setView([43.225, -2.1], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var ciudades = [];
        ciudades.push({"nombre": "Irun", "latitud": 43.3390, "longitud": -1.7896});
        ciudades.push({"nombre": "Errenteria", "latitud": 43.3119, "longitud": -1.8985});
        ciudades.push({"nombre": "Donostia/San Sebastián", "latitud": 43.3183, "longitud": -1.9812});
        ciudades.push({"nombre": "Hondarribia", "latitud": 43.3675, "longitud": -1.7881});
        ciudades.push({"nombre": "Pasaia", "latitud": 43.3194, "longitud": -1.9516});

        var todosMarker = L.marker([43.425, -2.1], {icon: L.icon({
            iconUrl:"https://www.citypng.com/public/uploads/preview/hd-red-locator-location-mark-sign-icon-png-701751695033097ea7mbblkgd.png?v=2024110812",
            iconSize:[40,40],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41]
        })}).addTo(map);
        todosMarker.bindPopup("TODOS").on('click', () => filtrarTabla("TODOS"));
        todosMarker.bindTooltip("TODOS", {
                permanent: true,
                direction: 'top',
                offset: L.point(0, -40)
            });

        ciudades.forEach(ciudad => {
            var marker = L.marker([ciudad.latitud, ciudad.longitud]).addTo(map);
            marker.bindPopup(ciudad.nombre);
            marker.on('click', () => filtrarTabla(ciudad.nombre.toUpperCase()));
            marker.bindTooltip(ciudad.nombre, {
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
