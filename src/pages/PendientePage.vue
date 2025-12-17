<template>
    <q-page class="full-height" style="overflow: auto">

        <div style=" z-index: 3;position: sticky; top: 0;"
            class="col-xs-12 col-sm-6 col-md-6 bg-grey-8 row q-pa-sm justify-between items-center q-mb-md">
            <span class="row items-center">
                <q-icon name="work" size="xs" color="grey-2" class="q-mr-sm" />
                <p class="q-ma-none text-grey-2">Ordenes por revisar</p>
            </span>
            <time class="text-white">{{ tiempoActual.currentTime }}</time>
        </div>

        <div class="row q-pa-sm full-width" style="height: calc(100% - 55px);">
            <q-table separator="cell" rows-per-page-label="0"   :dense="$q.screen.lt.md"
            style="width: 100%; height: 100%;" title="Sin revisar" :filter="filtro" bordered
            :rows="ordenesSinRevisar.rows" :columns="ordenesSinRevisar.columns" row-key="name">
            <template v-slot:top-right>
                <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="filtro" dense outlined>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn-toggle @click="TraerOrdenesSinRevisar" v-model="tipoOrdenSinRevisar" class="my-custom-toggle"
                    no-caps rounded unelevated toggle-color="primary" color="white" text-color="primary" :options="[
                        { label: 'Sin revisar', value: 0 },
                        { label: 'Revisadas Inconformes', value: 1 }
                    ]" />
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        <template v-if="col.name === 'Control'">
                            <q-btn color="blue" icon="folder">
                                <q-menu anchor="top right" self="top left" transition-show="jump-down" transition-hide="jump-up">
                                    <q-list class="cursor-pointer" icon="person" style="min-width: 100px">
                                        <q-item clickable v-close-popup
                                            @click="mostrarDialog(props.row.IdOrdenServicio)">Revisar</q-item>
                                        <q-item clickable v-close-popup
                                            @click="abrirModalEvidencia(props.row.IdOrdenServicio)">Evidencias</q-item>
                                        <q-item clickable v-close-popup
                                            @click="mostrarPdf(props.row.IdOrdenServicio)">PDF</q-item>
                                            <q-item clickable v-close-popup
                                            @click="mostrarPdfEvidencia(props.row.IdOrdenServicio)">PDF Evidencia</q-item>
                                        <q-item clickable v-close-popup
                                            @click="eliminarCompleto(props.row.eliminarCompleto)">Eliminar</q-item>
                                    </q-list>
                                </q-menu>
                            </q-btn>
                        </template>
                        <template v-else-if="col.name === 'IsEjecutada'">
                            <q-badge v-if="props.row.EstadoOrden === '0' || props.row.EstadoOrden === '1'"
                                :color="props.row.EstadoOrden === '0' ? 'red' : 'green'">
                                {{ col.value ? 'SI' : 'NO'
                                }}
                            </q-badge>

                            <q-badge v-else :color="col.value ? 'green' : 'red'">{{ col.value ? 'SI' : 'NO'
                                }}</q-badge>
                        </template>
                        <template v-else-if="col.name === 'Observacion'">
                        </template>
                        <template v-else>
                            <div class="text-left">{{ col.value }}</div>
                        </template>
                    </q-td>
                </q-tr>
                <q-tr :props="props" class="q-virtual-scroll--with-prev">
                    <q-td colspan="100%" :class="props.row.Observacion === null ? 'bg-grey-2' : ''">
                        <div class="text-left">{{ props.row.Observacion }}</div>
                    </q-td>
                </q-tr>
            </template>
            </q-table>
        </div>

        <q-dialog v-model="isDialog">
            <q-card class="my-card q-pb-md" style="width: 600px; max-width: 90vh; ">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Supervisión</div>
                </q-card-section>

                <q-separator />
                <q-btn-toggle v-model="OrdenServicio.IsEstado" spread no-caps toggle-color="negative" color="white"
                    text-color="grey-8" :options="buttons" />
                <q-card-actions class="row">

                    <q-input :rules="[Utils.regla]" style="resize: none ;" class="q-ma-sm col"
                        v-model="OrdenServicio.Observacion" filled type="textarea" />
                    <q-btn class="full-width" @click="GuardaAprobacionOrden" label="Guardar" color="fondo-p" />

                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="isEvidencia">
            <galeria-component :IsEditar="true"  :IdOrdenEvidencia="IdEvidencia" />
        </q-dialog>

    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import GaleriaComponent from "src/components/GaleriaComponent.vue";
import useCurrentTime from "src/components/useCurrentTime.js"

const tiempoActual = ref()
const isDialog = ref(false)
const isEvidencia = ref(false)
let IdUsuario


const filtro = ref('')
tiempoActual.value = useCurrentTime()
const ordenesSinRevisar = ref({rows: []})
const OrdenServicio = ref({})
const tipoOrdenSinRevisar = ref(0)
const IdEvidencia = ref(0)
OrdenServicio.value.IsEstado = true
const buttons = ref([
    { label: 'Aprobada', value: true },
    { label: 'No Aprobada', value: false }
])
ordenesSinRevisar.value.columns = [
    { align: "left", label: "Control", field: "Control", name: "Control" },
    { align: "left", label: "Código", field: "Codigo", name: "Codigo" },
    { align: "left", label: "Radicado", field: "Radicado", name: "Radicado" },
    { align: "left", label: "No Informe", field: "NumeroInforme", name: "NumeroInforme" },
    { align: "left", label: "Fecha Ejecuccion", field: "FechaEjecuccion", name: "FechaEjecuccion", format: (val) => Utils.darFormatofecha(val) },
    { align: "left", label: "Fecha Cargue", field: "FechaActualizacion", name: "FechaActualizacion", format: (val) => Utils.darFormatofechaConHoras(val) },
    { align: "left", label: "Barrio", field: "Barrio", name: "Barrio" },
    { align: "left", label: "Direccion", field: "Direccion", name: "Direccion" },
    { align: "left", label: "Inspector", field: "Usuario", name: "Usuario" },
    { align: "left", label: "Servicio", field: "Servicio", name: "Servicio" },
    { align: "left", label: "Distribuidora", field: "Distribuidora", name: "Distribuidora" },
    { align: "left", label: "Tipo Instalacion", field: "TipoInstalacion", name: "TipoInstalacion" },
    { align: "left", label: "Grupo", field: "Grupo", name: "Grupo" },
    { align: "left", label: "Ejecutada", field: "IsEjecutada", name: "IsEjecutada" },
    { align: "left", field: "Observacion", name: "Observacion" }
]
const mostrarPdf = async (idOrden) => {
    Utils.loadingNotify(true, "Cargando...");
    try {
        const response = await Api.get(`orden/${idOrden}/pdf`);
        Utils.loadingNotify(false, "");

        if (response.data) {
            const url = response.data.Dato;
            window.open("https://web.neosage.co/WebApiServigas/Pdfs/" + url + ".pdf", '_blank');
            // window.open("http://192.168.0.120/WebApiServiGas/Pdfs/" + url + ".pdf", '_blank');

        }
    } catch (e) {
        console.log(e);
    }
}

const mostrarPdfEvidencia = async (idOrden) => {
    Utils.loadingNotify(true, "Cargando...");
    try {
        const response = await Api.get(`orden/${idOrden}/pdf`);
        Utils.loadingNotify(false, "");

        if (response.data) {
            const url = response.data.Dato;
            window.open("https://web.neosage.co/WebApiServigas/Pdfs/" + url+ "_Evidencia" + ".pdf", '_blank');
            // window.open("http://192.168.0.120/WebApiServiGas/Pdfs/" + url+ "_Evidencia" + ".pdf", '_blank');

        }
    } catch (e) {
        console.log(e);
    }
}


const TraerOrdenesSinRevisar = async () => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const response = await Api.get(`tramite/ordensinrevisar/${tipoOrdenSinRevisar.value}/usuario/${IdUsuario}`)
        ordenesSinRevisar.value.rows = response.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
const abrirModalEvidencia = async (idOrden) => {
    IdEvidencia.value = idOrden
    isEvidencia.value = true
}
const GuardaAprobacionOrden = async () => {
    if (!(await Utils.confirmarAccion("Seguro de realizar el registro?"))) {
        return
    }
    Utils.loadingNotify(true, "Cargando...")
    try {
        OrdenServicio.value.IdUsuario = IdUsuario
        const response = await Api.post("tramite/orden/revisar", OrdenServicio.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            OrdenServicio.value = {}
            TraerOrdenesSinRevisar()
            isDialog.value = false
        }
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
const mostrarDialog = async (Id) => {
    isDialog.value = true,
        OrdenServicio.value.IdOrdenServicio = Id
}
onMounted(async () => {
    Utils.datoUsuario()
    .then(response => {
        IdUsuario = response.IdUsuario
        TraerOrdenesSinRevisar()
    })
    .catch(error => {
        console.log(error)
    })

})
</script>
