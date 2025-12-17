<template>
    <q-page class="full-height" style="overflow: auto">

        <div style="height: 45px" class="q-pa-sm col-xs-12 col-sm-6 col-md-6 bg-grey-8 row justify-between items-center">
            <span class="row items-center">
                <p class="q-ma-none text-grey-2">Reportes</p>
            </span>
            <div style="border-radius: 5px; gap: 5px;" class="bg-white row q-pa-xs items-center">

                <q-btn-toggle v-model="Filtro.IsEstado" spread no-caps toggle-color="blue" color="white"
                    text-color="black" :options="[
                        { label: 'General', value: false },
                        { label: 'Terminados', value: true }
                    ]" />
            </div>
        </div>

        <div class="row q-pa-sm q-col-gutter-sm">

            <q-select color="grey-9" emit-value class="col-xs-12 col-sm-12 col-md-4" outlined label-color="blue-8"
                v-model="Filtro.Filtro" :options="tipoFiltros" label="Filtrar Por">
                <template v-slot:append>
                    <q-icon name="filter_alt" color="blue-8" />
                </template>
            </q-select>

            <q-input type="date" outlined label="Desde" class="col-xs-12 col-sm-6 col-md-4"
                v-model="Filtro.FechaInicio">
                <template v-slot:prepend>
                    <q-icon name="event" />
                </template>
            </q-input>

            <q-input type="date" outlined label="Hasta" class="col-xs-12 col-sm-6 col-md-4" v-model="Filtro.FechaFin">
                <template v-slot:prepend>
                    <q-icon name="event" />
                </template>
            </q-input>


            <q-select v-if="Filtro.Filtro == 'Distribuidor'" map-options outlined option-label="Nombre"
                option-value="IdDistribuidora" class="col-xs-12 col-sm-12 col-md-4"  emit-value :options="distribuidoras"
                square v-model="Filtro.IdDistribuidora" label="Distribuidora">
                <template v-slot:prepend>
                    <q-icon name="store" />
                </template>
            </q-select>
 
            <q-select v-if="Filtro.Filtro == 'Inspector'" outlined option-label="NombreCompleto"
                option-value="IdUsuario" class="col-xs-12 col-sm-12 col-md-4" emit-value :options="usuariosXSupervisor"
                square v-model="Filtro.IdInspector" map-options label="Inspectores">
                <template v-slot:prepend>
                    <q-icon name="person" />
                </template>
            </q-select>

            <q-select v-if="Filtro.Filtro == 'Grupo'" outlined option-label="Nombre" option-value="IdGrupoTrabajo"
                class="col-xs-12 col-sm-12 col-md-4" emit-value :options="gruposTrabajo" square
                v-model="Filtro.IdGrupoTrabajo" map-options label="Grupo">
                <template v-slot:prepend>
                    <q-icon name="person" />
                </template>
            </q-select> 

                <q-select v-if="Filtro.Filtro == 'Usuario'" use-input outlined
                    @update:model-value="(val) => Filtro.IdTercero = val.IdTercero" map-options v-model="Filtro.Tercero" label="Usuario"
                    option-label="NombreCompleto" color="blue-8" :options="terceros.datos" @filter="filtrarTercero"
                    class="col-xs-12 col-sm-16 col-md-4">
                    <template v-slot:prepend>
                        <q-icon name="person" />
                    </template>

                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section avatar>
                                <q-icon name="person" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ scope.opt.NombreCompleto }}</q-item-label>
                                <q-item-label caption>{{ scope.opt.Identificacion }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>



            <div style="gap: 10px;" class="items-center row">
                <q-btn @click="CrearExcel" style="height: 40px" icon="download_for_offline" color="fondo-p" />
                <q-btn @click="CrearExcelPlataforma" v-if="IdRol === 1 || IdRol === 2" label="Sicerco"
                    style="height: 40px" icon="download_for_offline" color="fondo-p" />
                <q-btn @click="traerXFiltro" style="height: 40px" icon="search" color="red" />
            </div>

        </div>


        <q-table :rows-per-page-options="[0]" style="height: calc(100% - 255px);" class="col q-ma-sm"
            :dense="$q.screen.lt.md" :rows="resultados.rows" />

    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import { date } from "quasar"
const Filtro = ref({
    FechaInicio: null,
    FechaFin: null,
    Filtro: 'Distribuidor',
    General: false,
    IsEstado: true
})
const terceros = ref({ datos: [] })

async function asignarFechas() {
    Filtro.value.FechaInicio = date.formatDate(Date.now(), 'YYYY-MM-DD')
    Filtro.value.FechaFin = date.formatDate(Date.now(), 'YYYY-MM-DD')
}

const distribuidoras = ref([])
const usuariosXSupervisor = ref([])
const resultados = ref({rows: []})
const gruposTrabajo = ref([])
const tipoFiltros = [
    { label: "Usuario", value: "Usuario" },
    { label: "Distribuidor", value: "Distribuidor" },
    { label: "Fecha Ejecución", value: "FechaEjecuccion" },
    { label: "Fecha Aprobación", value: "FechaAprobacion" },
    { label: "Fecha Cargue", value: "FechaCargue" },
    { label: "Inspector", value: "Inspector" },
    { label: "Sin revisar", value: "SinRevisar" },
    { label: "Grupo", value: "Grupo" },
]

let IdUsuario
let IdRol 



 
const CrearExcel = async () => {
    Utils.loadingNotify(true, "")
    try {
        const response = await Api.post(`orden/excel/`, Filtro.value, { responseType: 'arraybuffer' })
        if (response.data.byteLength === 0) {
            Utils.loadingNotify(false, "")
            Utils.notificacion("No hay datos disponibles para el período seleccionado", null);
            return;
        }
        const blob = new Blob([response.data], { type: 'application/excel' })

        const blobURL = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobURL
        link.download = date.formatDate(Date.now(), 'DD-MM-YYYY HH:mm:ss') + '.xlsx'
        link.click()

        Utils.loadingNotify(false, "")

        URL.revokeObjectURL(blobURL);
    } catch (error) {

        Utils.loadingNotify(false, "")
        Utils.notificacion("No hay datos para esas fechas")


    }
}
const CrearExcelPlataforma = async () => {
    Utils.loadingNotify(true, "")
    try {
        const response = await Api.post(`orden/excelsicerco/`, Filtro.value, { responseType: 'arraybuffer' })
        if (response.data.byteLength === 0) {
            Utils.loadingNotify(false, "")
            Utils.notificacion("No hay datos disponibles para el período seleccionado", null);
            return;
        }
        const blob = new Blob([response.data], { type: 'application/excel' })

        const blobURL = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobURL
        link.download = date.formatDate(Date.now(), 'DD-MM-YYYY HH:mm:ss') + '.xlsx'
        link.click()

        Utils.loadingNotify(false, "")

        URL.revokeObjectURL(blobURL);
    } catch (error) {

        Utils.loadingNotify(false, "")
        Utils.notificacion("No hay datos para esas fechas")


    }
}
const filtrarTercero = async (filtro, update) => {
    if (filtro.undefined || filtro === '') {
        return
    }
    try {
        const response = await Api.get(`tercero/nombre/${filtro}`);
        update(() => {
            if (response.data !== '') {
                terceros.value.datos = response.data
            } else {
                const needle = val.toLowerCase();
                terceros.value.datos = stringOptions.filter(option =>
                    option.toLowerCase().includes(needle)
                );
            }
        });
    } catch (error) {
        console.log(error);
    }
}
const traerDistribuidoras = async () => {
    const response = await Api.get(`tramite/distribuidora`)
    distribuidoras.value = response.data
}
const traerUsuariosXSupervisor = async () => {
    const response = await Api.get(`usuario/rol/${3}`)
    usuariosXSupervisor.value = response.data
}
const traerXFiltro = async () => {
    Utils.loadingNotify(true, "Buscando resultados")

    try {
        const response = await Api.post("tramite/filtro", Filtro.value)
        resultados.value.rows = response.data
        Utils.loadingNotify(false)

    } catch (error) {
        Utils.notificacion("Ocurrio algo", error)
    }
}
const traerGruposTrabajo = async () => {

    Utils.loadingNotify(true, "Cargando")
    try {
        const response = await Api.get("usuario/listargrupos")
        gruposTrabajo.value = response.data
        Utils.loadingNotify(false)
    } catch (error) {

        console.log(error)
    }
}



onMounted(async () => {

    Utils.datoUsuario()
        .then(response => {
            IdUsuario = response.IdUsuario
            IdRol = response.IdRol
            Filtro.value.IdUsuario = response.IdUsuario

            asignarFechas()
            traerUsuariosXSupervisor()
            traerDistribuidoras()
            traerGruposTrabajo()
        })
        .catch(error => {
            console.log(error)
        })

})

</script>
