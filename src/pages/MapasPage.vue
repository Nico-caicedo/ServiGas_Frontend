<template>
    <q-page class="q-pa-sm full-height bg-white">
        <div id="map" style="width: 100%; height: 100%"></div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"

const Ubicaciones = ref([
    {
        Latitud: 1.614587, Longitud: -75.619146,
        Contenido: "<b>Mi casa</b>  <p>Contenido Bogotá</p><img src='https://bogota.gov.co/sites/default/files/styles/1050px/public/2023-08/bogota_5.jpeg' style='width: 100px' />"
    }
])

const iniciarMapa = async () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: { lat: Ubicaciones.value[0].Latitud, lng: Ubicaciones.value[0].Longitud }
    })

    Ubicaciones.value.forEach(ubicacion => {
        const infowindow = new google.maps.InfoWindow({
            content: ubicacion.Contenido
        })

        const marker = new google.maps.Marker({
            position: { lat: ubicacion.Latitud, lng: ubicacion.Longitud },
            map: map,
            title: ubicacion.Contenido
        })

        const polygonPath = [
            { lat: ubicacion.Latitud + 0.0000992424, lng: ubicacion.Longitud - 0.0000899321 }, // Esquina superior izquierda
            { lat: ubicacion.Latitud + 0.0000992424, lng: ubicacion.Longitud + 0.0000159321 }, // Esquina superior derecha
            { lat: ubicacion.Latitud - 0.0000999321, lng: ubicacion.Longitud + 0.0000159321 }, // Esquina inferior derecha
            { lat: ubicacion.Latitud - 0.0000999321, lng: ubicacion.Longitud - 0.0000899321 }  // Esquina inferior izquierda
        ];

        // Crear el polígono con las coordenadas
        const polygon = new google.maps.Polygon({
            paths: polygonPath,
            map: map,
            fillColor: '#AA0000',
            fillOpacity: 0.35,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
        });

        // Definir el ángulo de rotación del polígono en grados (en sentido horario)
        const rotationAngle = -60; // Por ejemplo, 45 grados de rotación

        // Rotar el polígono
        polygon.setOptions({rotation: rotationAngle});

        marker.addListener('click', () => {
            infowindow.open(map, marker)
        })
    })
}

const cargarMapa = () => {
    const script = document.createElement('script')

    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBRdWtoCsSOuTdNHmVvDGsj8AZBDr1cs1A'
    script.async = true
    script.defer = true
    script.onload = iniciarMapa
    document.head.appendChild(script)
}

onMounted(() => {
    cargarMapa()
})
</script>


<!-- AIzaSyBRdWtoCsSOuTdNHmVvDGsj8AZBDr1cs1A -->