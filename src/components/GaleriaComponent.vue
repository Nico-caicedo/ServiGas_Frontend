<template>
    <div class="bg-white" style="width: 95% !important; max-width: none; min-height: none; height: 95%;">

        <div class="fondo-p q-pa-sm row items-center text-white justify-between"
            style="z-index: 1;position: sticky; top: 0; height: 40px;">
            <p class="q-ma-none">Evidencia fotografica</p>
            <q-btn size="sm" icon="download" @click="descargarImagenes" color="white" text-color="blue-8" />
        </div>


        <div style="gap: 10px;" class="q-pa-sm row justify-evenly">

            <div style=" background-color: #f9f9f9; cursor: pointer; " v-for="(imagen, index) in ImagenesXOrden"
                :key="index">
                <q-img style="width: 300px; max-width: 90vh; height: 450px; " @click="mostrarImagen(imagen.Ruta)"
                    :src="`https://web.neosage.co/WebApiServigas/Imagenes/` + imagen.Ruta" fit="contain" />
                <div class="bg-grey-7 column items-center justify-center" style="height: 60px;">
                    <p class="q-ma-none text-white">{{ imagen.NombreImagen }}</p>
                    <p class="q-ma-none text-grey-2">{{ imagen.Servicio }}</p>
                    <q-btn v-if="IsEditar" color="grey-2" text-color="grey-9" icon="cloud_upload"
                        @click="actualizarImagen(imagen.Ruta)" />

                </div>
            </div>

        </div>

        <q-dialog v-model="dialogoAbierto" :content-css="{ width: '95%', height: '95%' }">
            <q-img :src="imagenSeleccionada" fit="" />
        </q-dialog>

    </div>
</template>

<script>
import { ref, watch } from "vue"
import Utils from "src/utils/Utils"
import Api from "src/services/Api.vue"
export default {

    props: {
        IdOrdenEvidencia: Number,
        IsEditar: Boolean
    },

    setup(props) {

        const ImagenesXOrden = ref({})
        const dialogoAbierto = ref(false)
        const imagenSeleccionada = ref("")


        const traerImagenesXIdOrdenServicio = async (idOrden) => {
            Utils.loadingNotify(true, "Cargando evidencia..")
            try {
                const response = await Api.get(`tramite/evidencia/${idOrden}`)
                if ((response).data != null) {
                    ImagenesXOrden.value = response.data
                }
                Utils.loadingNotify(false, "")
            } catch (error) {
                console.log(error)
            }
        }

        const descargarImagenes = () => {
            ImagenesXOrden.value.forEach(imagen => {
                const a = document.createElement('a')
                a.download = true
                a.target = '_blank'
                a.href = `https://web.neosage.co/WebApiServigas/Imagenes/` + imagen.Ruta
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
            })
        }

        const actualizarImagen = async (nombreImagen) => {


            try {
                const Ruta64 = await Utils.tomarFoto(2)
                if (Ruta64) {

                    if (!(await Utils.confirmarAccion("Seguro de actualizar la imagen?"))) {
                        return
                    }

                    const Imagen = {
                        Ruta: Ruta64,
                        NombreImagen: nombreImagen
                    }
                    Utils.loadingNotify(true, "Actualizando Imagen...")

                    const response = await Api.post("orden/actualizar/imagen", Imagen)

                    Utils.loadingNotify(false, "")
                    Utils.notificacion(response.data.Mensaje, response.data.IsExito)

                    traerImagenesXIdOrdenServicio(props.IdOrdenEvidencia)

                }
            } catch (error) {
                Utils.loadingNotify(false, "")
                Utils.notificacion("La imagen se actualiza desde el movil" + error, false)
            }

        }

        const mostrarImagen = (ruta) => {
            imagenSeleccionada.value = `https://web.neosage.co/WebApiServigas/Imagenes/${ruta}`
            dialogoAbierto.value = true
        }

        watch(() => props.IdOrdenEvidencia, (newValue, oldValue) => {
            traerImagenesXIdOrdenServicio(newValue)
        }, { immediate: true })

        return {
            ImagenesXOrden,
            descargarImagenes,
            actualizarImagen,
            traerImagenesXIdOrdenServicio,
            dialogoAbierto,
            imagenSeleccionada,
            mostrarImagen
        }
    }
}
</script>
