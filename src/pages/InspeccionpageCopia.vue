<template>
    <q-page class="full-height" style="overflow: auto">

        <div class="col-xs-12 col-sm-6 col-md-6 bg-grey-8 row q-pa-sm justify-between items-center q-mb-md">
            <span class="row items-center">
                <q-icon name="work" size="xs" color="grey-2" class="q-mr-sm" />
                <p class="q-ma-none text-grey-2">Ordenes</p>
            </span>

            <p v-show="isEjecutandose" class="q-ma-none q-ml-sm text-grey-2">{{ estadoCronometro ?
                'Activo' : 'Inactivo' }} <q-icon :name="estadoCronometro ?
                    'timer' : 'hourglass_disabled'" /> </p>
            <time class="text-white">{{ tiempoActual.currentTime }}</time>

        </div>

        <div class="absolute-bottom-left q-mb-md q-mr-sm">
            <q-fab color="orange" text-color="white" icon="add" direction="right">
                <q-fab-action @click="TraerHistorial" color="blue-8" text-color="white" icon="history" />
                <q-fab-action color="negative" v-show="isEjecutandose" @click="volverATabla" text-color="white"
                    icon="close" />
                <q-fab-action color="blue-8" v-show="!isEjecutandose" @click="TraerOrdenAsignada" text-color="white"
                    icon="refresh" />
                <q-fab-action color="purple-8" v-show="isEjecutandose" @click="crearNuevaImagen" text-color="white"
                    icon="add_a_photo" />
            </q-fab>
        </div>

        <q-scroll-area class="q-pl-sm q-pb-sm q-pr-sm q-pt-none" style="height:calc(100% - 65px)">

            <q-card class="row" v-show="!isEjecutandose">
                <q-table :dense="$q.screen.lt.md" rows-per-page-label="0" class="col bg-white" grid bordered
                    :rows="OrdenesAsignadas.rows" :columns="OrdenesAsignadas.columns" row-key="name">
                    <template v-slot:item="props">
                        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                            <q-card flat bordered>
                                <q-card-section class="text-center bg-grey-3">
                                    <strong>Usuario {{ props.row.Tercero }}<br> Código: {{ props.row.Matricula
                                        }}</strong>
                                </q-card-section>
                                <q-separator />
                                <q-card-section class="text-grey-9">
                                    <q-item-label class="">Radicado: {{ props.row.Radicado }}</q-item-label>
                                    <q-item-label class="">Fecha: {{ Utils.darFormatofechaConHoras(props.row.Fecha)
                                        }}</q-item-label>
                                    <q-item-label class="">Barrio: {{ props.row.Barrio }}</q-item-label>
                                    <q-item-label class="">Direccion: {{ props.row.Direccion }}</q-item-label>
                                    <q-item-label class="">Inspector: {{ props.row.Usuario }}</q-item-label>
                                    <q-item-label class="">Creador: {{ props.row.Supervisor }}</q-item-label>
                                    <q-item-label class="">Tipo Servicio: {{ props.row.Causante }}</q-item-label>
                                    <q-item-label class="">Tipo Instalacion: {{ props.row.TipoInstalacion
                                        }}</q-item-label>
                                    <q-item-label class="">Distribuidora: <q-badge>{{ props.row.Distribuidora
                                            }}</q-badge></q-item-label>
                                    <q-item-label class="">Telefono: {{ props.row.Telefono }}</q-item-label>
                                </q-card-section>
                                <q-separator />
                                <q-card-section class="flex flex-center">
                                    <q-btn @click="TomarOrden(props.row.IdOrdenServicio, props.row.Causante)"
                                        label="Tomar Orden" color="green" />
                                </q-card-section>

                            </q-card>
                        </div>
                    </template>
                </q-table>
            </q-card>

            <q-form @submit.prevent="GuardarInspeccion" v-if="isEjecutandose">

                <div class="bg-white borde-interno q-mb-md" style="border: 1px solid #26A69A !important">
                    <div class="row items-center justify-center text-white text-center"
                        style="background-color: #2d7dc2; height: 30px"> Medidor
                    </div>
                    <div class="q-ma-sm row q-col-gutter-sm">
                        <q-input :rules="[Utils.regla]" lazy-rules label="Lectura m3" outlined
                            class="col-xs-12 col-sm-4 col-md-4" step="any" square type="number"
                            v-model="OrdenServicio.Metro">

                            <template v-slot:prepend>
                                <q-icon name="design_services" />
                            </template>
                        </q-input>

                        <q-input :rules="[Utils.regla]" lazy-rules label="Serial Medidor" outlined
                            class="col-xs-12 col-sm-4 col-md-4" square type="text" v-model="OrdenServicio.Serial">

                            <template v-slot:prepend>
                                <q-icon name="dns" />
                            </template>
                        </q-input>

                        <q-input :rules="[Utils.regla]" lazy-rules outlined label="Marca"
                            class="col-xs-12 col-sm-4 col-md-4" square type="text" v-model="OrdenServicio.Marca">

                            <template v-slot:prepend>
                                <q-icon name="badge" />
                            </template>
                        </q-input>


                        <q-input bg-color="orange-2" :rules="[Utils.regla]" lazy-rules outlined label="Número Informe"
                            class="col-xs-12 col-sm-4 col-md-4" square type="number"
                            v-model="OrdenServicio.NumeroInforme">

                            <template v-slot:prepend>
                                <q-icon name="dns" />
                            </template>
                        </q-input>

                        <q-select lazy-rules outlined option-label="Nombre" option-value="IdEstadoVisita"
                            :rules="[Utils.regla]" class="col-xs-12 col-sm-4 col-md-4 " map-options emit-value
                            :options="estadovisita" square v-model="OrdenServicio.IdEstadoVisita" label="EstadoVisita">
                            <template v-slot:prepend>
                                <q-icon name="store" />
                            </template>
                        </q-select>

                        <q-input :readonly="estadoCronometro"
                            :rules="[val => Utils.reglaBloqueada(val, estadoCronometro)]" type="date" outlined
                            label="Fecha Ejecucción" class="col-xs-12 col-sm-4 col-md-4"
                            v-model="OrdenServicio.FechaEjecuccion">
                            <template v-slot:prepend>
                                <q-icon name="event" />
                            </template>
                        </q-input>

                        <q-input :readonly="OrdenServicio.IdTipoServicio !== 2 && OrdenServicio.IdTipoServicio !== 4"
                            :rules="[val => Utils.reglaBloqueada(val, OrdenServicio.IdTipoServicio !== 2 && OrdenServicio.IdTipoServicio !== 4)]"
                            type="text" outlined label="Nombre Instalador" class="col-xs-12 col-sm-4 col-md-8"
                            v-model="OrdenServicio.NombreInstalador">
                            <template v-slot:prepend>
                                <q-icon name="person" />
                            </template>
                        </q-input>


                        <q-input type="text" outlined label="Observación" class="col-xs-12 col-sm-12 col-md-12"
                            v-model="OrdenServicio.Observacion">
                            <template v-slot:prepend>
                                <q-icon name="description" />
                            </template>
                        </q-input>

                    </div>

                </div>

                <div class="bg-white borde-interno q-mb-md" style="border: 1px solid #2d7dc2 !important">
                    <div class="row items-center justify-center text-white text-center" style="height: 30px; background-color: #2d7dc2;">
                        Imagenes
                    </div>

                    <div class="q-pa-sm flex justify-around" style="gap: 15px">

                        <q-card class="my-card bg-grey-2" @click="tomarFoto(imagen.IdImagen, imagen.Prioridad)"
                            style="width: 148px" v-for="(imagen, index) in ImagenesXServicio" :key="index"
                            :class="{ 'disable_card no-pointer-events': imagen.Estado === false, 'cursor-pointer': imagen.Estado !== false }">
                            <q-img :src="imagen.Ruta">
                            </q-img>

                            <q-card-section>
                                <p class="q-none text-subtitle2">{{ imagen.NombreImagen }}</p>
                                {{ imagen.TiempoRestante }}
                            </q-card-section>

                        </q-card>

                    </div>
                </div>
                <div class="row">

                    <q-file bg-color="red-2" accept="application/pdf" outlined :rules="[Utils.regla]"
                        max-file-size="1992294" class="q-mb-md col-xs-12 col-sm-12 col-md-12" name="poster_file"
                        v-model="Pdf" label="Cargar pdf" @rejected="handleInputError" />

                    <q-btn color="green" class="self-center col-xs-12 col-sm-12 col-md-12" type="submit" label="Guardar" />
                </div>

            </q-form>

            <q-dialog v-model="isHistorial">
                <q-card style="width: 800px; max-width: 100vh; height: 100%;">
                    <q-card-section style="position: sticky; top: 0; z-index: 3;"
                        class="items-center full-width row justify-between bg-grey-8 text-white">
                        <div class="text-h6">Historial </div>
                        <q-btn size="sm" @click="buscarFiltro('Corregir')" :label="historialTemporal.filter((orden) => orden.EstadoOrden === 'Corregir').length" color="red">
                            <q-tooltip class="bg-red" :offset="[10, 10]"> Corregir</q-tooltip>
                        </q-btn>
                        <q-btn size="sm" @click="buscarFiltro('Corregida')" :label="historialTemporal.filter((orden) => orden.EstadoOrden === 'Corregida').length" color="blue">
                            <q-tooltip class="bg-blue" :offset="[10, 10]"> Corregida</q-tooltip>
                        </q-btn>
                        <q-btn size="sm" @click="buscarFiltro('Terminado')" :label="historialTemporal.filter((orden) => orden.EstadoOrden === 'Terminado').length" color="green">
                            <q-tooltip class="bg-green" :offset="[10, 10]"> Terminado</q-tooltip>
                        </q-btn>
                        <q-btn size="sm" @click="buscarFiltro('Pendiente')" :label="historialTemporal.filter((orden) => orden.EstadoOrden === 'Pendiente').length" color="orange">
                            <q-tooltip class="bg-orange" :offset="[10, 10]"> Pendiente</q-tooltip>
                        </q-btn>
                        <q-input bg-color="white" type="text" class="col-md-5 col-sm-5 col-xs-8 q-ml-sm q-mr-sm" dense
                            v-model="filtroHistorial" />
                        <span><q-btn icon="search" @click="buscarHistorial" text-color="black" color="white" /></span>
                    </q-card-section>
                    <q-separator />
                    <div class="row">
                        <q-timeline layout="dense" side="right" color="secondary">

                            <template :key="index" v-for="(log, index) in historial">

                                <q-timeline-entry color="blue" :title="`Número Informe ` + log.NumeroInforme"
                                    :subtitle="Utils.darFormatofechaConHoras(log.FechaActualizacion)" side="left">

                                    <q-card class="q-ma-sm my-card">

                                        <q-card-section
                                            :class="log.EstadoOrden === 'Corregir' ? 'bg-deep-orange' : log.EstadoOrden === 'Pendiente' ? 'bg-orange' : (log.EstadoOrden === 'Corregida' ? 'bg-blue' : 'bg-green')"
                                            class="text-white">
                                            <div class="text-subtitle2">Usuario {{ log.Usuario }}</div>
                                            <div class="text-subtitle2">Telefono {{ log.Telefono }}</div>
                                            <div class="text-subtitle2">Código: {{ log.Codigo }}</div>
                                            <div class="text-subtitle2">NO.Orden {{ log.IdOrdenServicio }}</div>
                                            <div class="text-subtitle2">Revisado {{ log.IsRevisado ? 'SI' : 'NO' }}
                                            </div>
                                            <div class="text-subtitle2">Estado {{ log.EstadoOrden }}</div>
                                        </q-card-section>
                                        <p class="q-ma-sm">Observaciones</p>
                                        <template v-for="obs in log.Observaciones" :key="obs.IdObservacion">

                                            <q-item>
                                                <q-item-section avatar top>
                                                    <q-icon name="radio_button_checked"
                                                        :color="obs.IsEstado ? 'green' : 'red'" size="34px" />
                                                </q-item-section>
                                                <q-item-section top>
                                                    <span class="text-grey-8">{{
                                                        Utils.darFormatofechaConHoras(obs.FechaCreacion) }}</span>
                                                    <p class="q-ma-none">{{ obs.Observacion }}</p>
                                                </q-item-section>
                                            </q-item>

                                            <q-file style="width: 90%;"
                                                v-if="log.EstadoOrden !== 'Terminado' && log.EstadoOrden !== 'Pendiente'"
                                                accept="application/pdf" bg-color="red-2" @rejected="handleInputError"
                                                max-file-size="1992294" outlined
                                                class="q-mb-md q-ml-md col-xs-12 self-center col-sm-12 col-md-12"
                                                name="poster_file" v-model="PdfActualizar" label="Cargar pdf" />

                                            <q-btn class="self-center q-ml-md q-mb-md"
                                                v-if="log.EstadoOrden !== 'Terminado' && log.EstadoOrden !== 'Pendiente'"
                                                color="green"
                                                @click="actualizarPdf(obs.IdObservacionOrden, log.NumeroInforme)"
                                                type="submit" label="Guardar" />
                                            <q-separator />
                                        </template>
                                    </q-card>

                                </q-timeline-entry>
                            </template>

                        </q-timeline>
                    </div>
                </q-card>
            </q-dialog>

        </q-scroll-area>

    </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import { date } from 'quasar'
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import useCurrentTime from "src/components/useCurrentTime.js"
import { useRouter, onBeforeRouteLeave } from "vue-router"
const router = useRouter()
const filtroHistorial = ref("")
const historialTemporal = ref([])
const tiempoActual = ref()
tiempoActual.value = useCurrentTime()
const OrdenServicio = ref({
    Imagenes: []
})
const isEjecutandose = ref(false)
const ImagenesXServicio = ref({})
let IdUsuario = ref()
const estadoCronometro = ref(false)
const estadovisita = ref([])
const historial = ref([])
const ContadorDeImagenes = ref(0)
const isHistorial = ref(false)
const OrdenesAsignadas = ref({ rows: [] })

const Pdf = ref(null)
const PdfActualizar = ref(null)
watch(Pdf, (newValue, oldValue) => {
    Pdf.value = newValue
})

watch(PdfActualizar, (newValue, oldValue) => {
    PdfActualizar.value = newValue
})


OrdenesAsignadas.value.columns = [
    { align: "left", label: "Matricula", field: "Matricula", name: "Matricula" },
    { align: "left", label: "Radicado", field: "Radicado", name: "Radicado" },
    { align: "left", label: "Fecha", field: "Fecha", name: "Fecha", format: (val) => Utils.darFormatofechaConHoras(val) },
    { align: "left", label: "Barrio", field: "Barrio", name: "Barrio" },
    { align: "left", label: "Direccion", field: "Direccion", name: "Direccion" },
    { align: "left", label: "Supervisor", field: "Supervisor", name: "Supervisor" },
    { align: "left", label: "Usuario", field: "Usuario", name: "Usuario" },
    { align: "left", label: "Telefono", field: "Telefono", name: "Telefono" },
    { align: "left", label: "Causante", field: "Causante", name: "Causante" },
    { align: "left", label: "Tipo Instalacion", field: "TipoInstalacion", name: "TipoInstalacion" },
]

const buscarHistorial = () => {
    buscarFiltro(filtroHistorial.value)
}
const buscarFiltro = (filtro) =>{
    historial.value = historialTemporal.value.filter(objeto =>
        Object.values(objeto).some(valor =>
            valor != null && valor.toString().toLowerCase().includes(filtro.toLowerCase())
        )
    )
}
const preguntarAntesDeSalir = async () => {
    if (!isEjecutandose.value) {
        return true
    }
    if (!(await Utils.confirmarAccion("¿Seguro de salir? Se perderá todo el progreso."))) {
        return false
    }
    return true
}
onBeforeRouteLeave((to, from, next) => {
    preguntarAntesDeSalir().then(confirmado => {
        if (confirmado) {
            next()
        } else {
            next(false)
        }
    })
})
const TraerOrdenAsignada = async () => {
    Utils.loadingNotify(true, 'Cargando información..')
    try {
        const response = await Api.get(`tramite/${IdUsuario.value}/asignados`)
        Utils.loadingNotify(false, '')
        if (response.data.length > 0) {
            OrdenesAsignadas.value.rows = response.data
            return
        }
        OrdenesAsignadas.value.rows = []
        Utils.notificacion("Sin ordenes pendientes", null)
    } catch (error) {
        console.log(error)
    }
}
const TraerHistorial = async () => {
    Utils.loadingNotify(true, 'Cargando historial..')
    try {
        const response = await Api.get(`orden/historial/${IdUsuario.value}`)
        Utils.loadingNotify(false, '')
        if (response.data.length > 0) {
            isHistorial.value = true
            historial.value = response.data
            historialTemporal.value = response.data
            return
        }
        historial.value = []
        Utils.notificacion("Sin historial", null)
    } catch (error) {
        console.log(error)
    }
}
const traerEstadoVisitas = async () => {
    Utils.loadingNotify(true, "Cargando...",)
    try {
        const response = await Api.get("tramite/estadovisita")
        estadovisita.value = response.data
        Utils.loadingNotify("", false)
    } catch (error) {
        console.log(error)
    }
}
const TomarOrden = async (IdOrdenServicio, Causante) => {
    if (!(await Utils.confirmarAccion("¿Estás seguro de tomar la orden?"))) {
        return;
    }

    let cargarConCronometro = await Utils.confirmarAccion("¿Cargar con cronómetro?");
    estadoCronometro.value = cargarConCronometro;

    OrdenServicio.value.IdOrdenServicio = IdOrdenServicio;
    OrdenServicio.value.IdTipoServicio = Causante === 'Previa' ? 2 : Causante === 'Reforma' ? 4 : 0;

    Utils.loadingNotify(true, 'Tomando orden...');

    try {
        const response = await Api.get(`tramite/tomarorden/${IdOrdenServicio}`);
        ContadorDeImagenes.value = response.data.length;
        Utils.loadingNotify(false, "");
        await IniciarImagenes(response.data);
        isEjecutandose.value = true;
    } catch (error) {
        console.log(error);
    }
}
let intervalo;
const volverATabla = async () => {
    if (!(await Utils.confirmarAccion("¿Estás seguro de cancelar la ejecución de la orden? Se perderá todo el progreso realizado hasta ahora."))) {
        return
    }
    clearInterval(intervalo);
    isEjecutandose.value = false
    estadoCronometro.value = false
    OrdenServicio.value = {}
    Pdf.value = null
    ImagenesXServicio.value = {}
    ContadorDeImagenes.value = 0
}
const handleInputError = async (error) => {
    Utils.notificacion("El archivo excede el tamaño máximo permitido de 1.9 MB", false)
}
const IniciarImagenes = async (imagenes) => {

    imagenes.forEach(imagen => {
        imagen.Ruta = null
        if (!estadoCronometro.value) {
            imagen.Estado = true
            imagen.Cargada = false
            return
        } else {

            if (imagen.Prioridad === 1) {
                imagen.Estado = true
                imagen.Cargada = false
            } else if (imagen.TiempoInicial == 1 && imagen.TiempoFinal == 1 && imagen.IdImagenEspera <= 0) {
                imagen.Estado = true
                imagen.Cargada = false

            } else {
                imagen.Estado = false
                imagen.Cargada = false
                imagen.TiempoRestante = imagen.TiempoInicial
            }
        }

    })
    ImagenesXServicio.value = await imagenes
}
const tomarFoto = async (IdImagen, Prioridad) => {

    const Tipo = await Utils.verOpcionesCamara();
    const Ruta64 = await Utils.tomarFoto(Tipo)

    if (Ruta64) {
        const imagenEncontrada = ImagenesXServicio.value.find(imagen => imagen.IdImagen === IdImagen)
        const PrimerImagen = ImagenesXServicio.value.find(imagen => imagen.Prioridad === 1)

        if (imagenEncontrada) {

            if (Tipo === 2 && !estadoCronometro.value) {
                imagenEncontrada.MarcaDeAgua = false
            } else {
                imagenEncontrada.MarcaDeAgua = true
            }
            imagenEncontrada.Ruta = Ruta64


            if ((imagenEncontrada.Prioridad === 1 || imagenEncontrada.IdImagenEspera > 0) && estadoCronometro.value) {
                imagenEncontrada.Estado = false
            } else {
                imagenEncontrada.Estado = true
            }

            imagenEncontrada.Cargada = true
            imagenEncontrada.FechaCreacion = date.formatDate(Date.now())

            console.log(imagenEncontrada)

            if (estadoCronometro.value === true) {

                if (Prioridad === 1) {
                    ValidarIntervalos()
                } else if (PrimerImagen.Cargada !== true) {
                    return
                }
                else if (imagenEncontrada.IdImagenEspera > 0 && imagenEncontrada.Cargada) {
                    let ImagenAntes = ImagenesXServicio.value.find(imagen => imagen.IdImagen === imagenEncontrada.IdImagenEspera)
                    if (ImagenAntes.Cargada) {
                        ValidarIntervalos()
                    } else {
                        alert("Imagen Padre no cargada!")
                    }
                }
            }
            else {
                return
            }
        }
    }

}
const ValidarIntervalos = async () => {
    let contador = 0;
    intervalo = setInterval(() => {
        contador++;
        // Lógica para validar intervalos
        ImagenesXServicio.value.forEach(imagen => {
            if (imagen.TiempoInicial === imagen.TiempoInicial && imagen.IdImagenEspera > 0) {
                if (ImagenesXServicio.value.find(item => item.IdImagen === imagen.IdImagen).Cargada === true) {
                    return;
                }
                const IdImagenAntes = imagen.IdImagenEspera;
                if (ImagenesXServicio.value.find(item => item.IdImagen === IdImagenAntes).Cargada === true) {
                    const IdImagen = imagen.IdImagen;
                    const tiempoRestanteSegundos = (imagen.TiempoInicial * 60) - contador;
                    if (tiempoRestanteSegundos < 0) {
                        clearInterval(intervalo);
                        return;
                    }
                    const minutos = Math.floor(tiempoRestanteSegundos / 60);
                    const segundos = tiempoRestanteSegundos % 60;
                    const tiempoRestanteFormateado = `${minutos} minutos ${segundos} segundos`;
                    ImagenesXServicio.value.find(item => item.IdImagen === IdImagen).TiempoRestante = tiempoRestanteFormateado;
                    if (tiempoRestanteSegundos <= 0) {
                        ImagenesXServicio.value.find(item => item.IdImagen === IdImagen).Estado = true;
                    }
                }
            }
        });
    }, 1000);
}
const GuardarInspeccion = async (event) => {

    let totalImagenesCargas = ImagenesXServicio.value.filter(img => img.Cargada === true)
    if (totalImagenesCargas.length < ContadorDeImagenes.value) {
        Utils.notificacion("Debe cargar todas las imagenes", false)
        return
    }
    if (Pdf.value === null) {
        Utils.notificacion("Debe cargar el pdf", false)
        return
    }
    if (!(await Utils.confirmarAccion("Seguro de realizar el registro ?"))) {
        return
    }

    Utils.loadingNotify(true, "Guardando evidencia, puede tardar un momento")
    OrdenServicio.value.Imagenes = ImagenesXServicio.value.map(imagen => ({
        Ruta: imagen.Ruta,
        IdImagen: imagen.IdImagen,
        MarcaDeAgua: imagen.MarcaDeAgua,
        FechaCreacion: imagen.FechaCreacion,
    }))

    OrdenServicio.value.IdUsuario = IdUsuario.value

    try {

        const response = await Api.post("tramite/ordenes/evidencia", OrdenServicio.value);
        Utils.respuesta(response.data)

        if (response.data.IsExito) {
            await GuardarPdf(OrdenServicio.value.NumeroInforme)
            isEjecutandose.value = false
            OrdenServicio.value = {}
            estadoCronometro.value = false

            Pdf.value = null

            TraerOrdenAsignada()
        }
        Utils.loadingNotify(false, "")
    } catch (error) {
        Utils.loadingNotify(false, "")
        Utils.notificacion("Tiempo agotado, vuelva a intentarlo")
    }

}
const crearNuevaImagen = async () => {
    const Tipo = await Utils.verOpcionesCamara();
    const Ruta64 = await Utils.tomarFoto(Tipo);

    if (Ruta64) {
        const Imagen = {
            Ruta: Ruta64,
            NombreImagen: 'Extra',
            IdImagen: 27,
            Estado: false
        }

        if (estadoCronometro.value === true) {
            Imagen.FechaCreacion = date.formatDate(Date.now())
            Imagen.MarcaDeAgua = true
        }

        console.log(Imagen)

        ImagenesXServicio.value.push(Imagen);
    }
}
const GuardarPdf = async (nombreArchivo) => {
    Utils.loadingNotify(true, "Subiendo pdf")

    try {

        const formData = new FormData();
        formData.append("pdf", Pdf.value)
        formData.append("NumeroInforme", nombreArchivo)
        const response = await Api.post("tramite/pdf", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        Utils.loadingNotify(false)
        return response.data

    } catch (error) {

        Utils.loadingNotify(false)
        Utils.notificacion(error, false)

    }
}
const actualizarPdf = async (IdObservacion, NumeroInforme) => {
    if (!(await Utils.confirmarAccion("Solo tiene un intento para corregir el pdf, desea continuar ?"))) {
        return
    }
    if (PdfActualizar.value === null || PdfActualizar.value == '') {
        Utils.notificacion("Seleccione Archivo", null)
        return
    }
    Utils.loadingNotify(true, "actualizando pdf")
    try {
        const formData = new FormData();
        formData.append("pdf", PdfActualizar.value)
        formData.append("NumeroInforme", NumeroInforme)
        formData.append("IdUsuarioA", IdUsuario.value)
        formData.append("IdObservacion", IdObservacion)
        const response = await Api.post("tramite/actualizar/pdf", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        Utils.loadingNotify(false)
        PdfActualizar.value = null
        TraerHistorial()

    } catch (error) {
        Utils.loadingNotify(false)
        Utils.notificacion(error, false)
    }
}
traerEstadoVisitas()


onMounted(async () => {

    Utils.datoUsuario()
        .then(response => {
            if (response === null) {
                router.push("/inicio/login")
                return
            }
            IdUsuario.value = response.IdUsuario

            TraerOrdenAsignada()
        })
        .catch(error => {
            console.log(error)
        })
})

</script>




<style>
.borde-interno {
    border: 1px solid #ddd;
    border-radius: 5px;
}

.disable_card {
    background: rgba(135, 132, 132, 0.16) !important;
    opacity: 0.5;
}
</style>