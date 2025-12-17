<template>
    <q-page class="full-height bg-white">

        <div class="col-xs-12 col-sm-6 col-md-6 fondo-p row q-pa-sm justify-between items-center">
            <span class="row items-center">
                <q-icon name="work" size="sm" color="grey-2" class="q-mr-sm" />
                <p class="q-ma-none text-grey-2">Ordenes Terminadas</p>
            </span>

        </div>

        <q-table  style="height: calc(100% - 63px);" rows-per-page-options="0" :dense="$q.screen.lt.md" separator="cell" class="q-ma-sm" :filter="filtro"
            bordered title="Terminadas REDNOVA" :rows="OcupacionTerminadasXDistribuidor.rows"
            :columns="OcupacionTerminadasXDistribuidor.columns" row-key="name">

            <template v-slot:body-cell-Evidencia="props">
                <td>
                    <q-btn color="primary" icon="folder">
                        <q-menu transition-show="jump-down" transition-hide="jump-up">
                            <q-list style="min-width: 100px">
                                <q-item clickable v-close-popup
                                    @click="abrirModalEvidencia(props.row.IdOrdenServicio)">Evidencias</q-item>
                                <q-item clickable v-close-popup
                                    @click="mostrarPdf(props.row.IdOrdenServicio)">Pdf</q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </td>

            </template>

            <template v-slot:top-right>
                <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="filtro.terminada" dense outlined>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn @click="traerOrdenesTerminadas(5)" icon="refresh" color="fondo-s" text-color="black" />
            </template>
        </q-table>
        <q-dialog v-model="isEvidencia">
            <galeria-component :IdOrdenEvidencia="IdEvidencia" />
        </q-dialog>




    </q-page>
</template>
<script setup>

import { ref, onMounted } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import GaleriaComponent from "src/components/GaleriaComponent.vue";
const traerTerceros = ref({
    rows: [],
    columns: []
})

let IdUsuario
Utils.datoUsuario()
    .then(response => {
        IdUsuario = response.IdUsuario
    })
    .catch(error => {
        console.log(error)
    })



const filtro = ref('')
const IdEvidencia = ref(0)
const OcupacionTerminadasXDistribuidor = ref({rows: []})
const isEvidencia = ref(false)



OcupacionTerminadasXDistribuidor.value.columns = [
    { align: "left", label: "Evidencia", field: "Evidencia", name: "Evidencia" },
    { align: "left", label: "Radicado", field: "Radicado", name: "Radicado" },
    { align: "left", label: "Código", field: "Matricula", name: "Matricula" },
    { align: "left", label: "Número Informe", field: "NumeroInforme", name: "NumeroInforme" },
    { align: "left", label: "Fecha Ejecución", field: "Fecha", name: "Fecha", format: (val) => Utils.darFormatofecha(val) },
    { align: "left", label: "Usuario", field: "Usuario", name: "Usuario" },
    { align: "left", label: "Barrio", field: "Barrio", name: "Barrio" },
    { align: "left", label: "Dirección", field: "Direccion", name: "Direccion" },
    { align: "left", label: "Servicio", field: "Causante", name: "Causante" },
    { align: "left", label: "Serial Medidor", field: "Serial", name: "Serial" },
    { align: "left", label: "Distribuidor", field: "Distribuidora", name: "Distribuidora" },
    { align: "left", label: "Tipo Instalación", field: "TipoInstalacion", name: "TipoInstalacion" },
]





const mostrarPdf = async (idOrden) => {
    Utils.loadingNotify(true, "Cargando...");
    try {
        const response = await Api.get(`orden/${idOrden}/pdf`);
        Utils.loadingNotify(false, "");
        const url = response.data.Dato;
        window.open("https://web.neosage.co/WebApiServigas/Pdfs/" + url + ".pdf", '_blank');
    } catch (e) {
        console.log(e);
    }
}
const traerOrdenesTerminadas = async (IdDistribuidora) => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const response = await Api.get(`tramite/terminados/${IdDistribuidora}/Distribuidora`)
        OcupacionTerminadasXDistribuidor.value.rows = response.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }
}
const abrirModalEvidencia = async (idOrden) => {
    IdEvidencia.value = idOrden
    isEvidencia.value = true
}
onMounted(async () => {
    await traerOrdenesTerminadas(5)
})

</script>
