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
            /*
            marker.bindTooltip(baliza.nombre, {
                direction: 'top',
                offset: L.point(0, 0)
            });
            */
        });

    </script>

</body>
</html>
