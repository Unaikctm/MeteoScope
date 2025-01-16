//Mapa en OpenStreetMap
var map = L.map('mapid').setView([43.0, -2.5], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);

const url = 'http://127.0.0.1:85/balizas';
const balizas = "";
fetch(url)
    .then(response => response.json())
    .then(balizas =>{
        balizas.forEach(baliza => {
            var marker = L.marker([baliza.latitud, baliza.longitud]).addTo(map);
            marker.bindPopup(baliza.nombre);
        });
    });

