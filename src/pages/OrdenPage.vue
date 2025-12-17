<template>
    <q-page class="full-height bg-white">

        <div class="col-xs-12 col-sm-6 col-md-6 bg-grey-8 row q-pa-sm justify-between items-center">
            <span class="row items-center">
                <q-icon name="work" size="sm" color="grey-2" class="q-mr-sm" />
                <p class="q-ma-none text-grey-2">Asignación ordenes</p>
            </span>
        </div>

        <q-tabs mobile-arrows v-model="estadoTab" dense class="bg-grey-8 text-grey-2" active-color="white"
            indicator-color="grey-8" align="justify">
            <q-tab label="Por asignar" name="SinAsignar" />
            <q-tab label="Pendientes" name="OrdenPendientes" />
            <q-tab label="Terminadas" name="OrdenTerminadas" />
        </q-tabs>
        <q-tab-panels style="height: calc(100% - 78px) !important;" v-model="estadoTab" animated
            class="q-pa-none text-grey-9 ">

            <q-tab-panel style="height: 100%;" name="SinAsignar" class="column q-pa-sm">

                <q-table :dense="$q.screen.lt.md" separator="cell" rows-per-page-options="0" style="width: 100%;"
                    :filter="filtro.sinAsignar" title="Sin asignar" :rows="TramitesSinAsignar.rows"
                    :columns="TramitesSinAsignar.columns" row-key="IdTramite" selection="multiple"
                    v-model:selected="seleccion">
                    <template v-slot:top-right>
                        <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="filtro.sinAsignar" dense
                            outlined>
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                        <q-btn @click="traerTramitesSinAsignar" icon="refresh" color="fondo-s" text-color="black" />
                    </template>
                    <template v-if="seleccion.length > 0" v-slot:top-left>
                        <q-btn @click="guardarCambios" icon="save" label="Asignar" class="q-mr-md" color="green"
                            text-color="white" />
                        <q-btn @click="eliminarTramite" icon="delete" label="Eliminar" color="red" text-color="white" />
                    </template>
                </q-table>

                <q-dialog v-model="ventanaUsuarios">
                    <q-card class="my-card q-pb-md" style="width: 400px; max-width: 90vh; ">
                        <q-card-section class="bg-primary text-white">
                            <div class="text-h6">Usuarios</div>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions class="row">

                            <q-select :rules="[Utils.regla]" lazy-rules option-label="NombreCompleto"
                                option-value="IdUsuario" map-options emit-value
                                class="q-mb-md col-xs-12 col-sm-12 col-md-12" filled
                                v-model="OrdenOcupacion.IdContratista" :options="usuarios" label="Usuarios">
                                <template v-slot:prepend>
                                    <q-icon name="person" />
                                </template>
                            </q-select>

                            <q-btn class="full-width" @click="asignarTramite" label="Asignar" color="fondo-p" />


                        </q-card-actions>
                    </q-card>
                </q-dialog>

            </q-tab-panel>
            <q-tab-panel style="height: 100%;" name="OrdenPendientes" class="column q-pa-sm">
                <q-table :dense="$q.screen.lt.md" rows-per-page-options="0" separator="cell"
                    style="height: 100% ; width: 100%" :filter="filtro.pendiente" bordered title="Pendientes"
                    :rows="OcupacionPendiente.rows" :columns="OcupacionPendiente.columns" selection="multiple"
                    row-key="IdOrdenServicio" v-model:selected="seleccionados">

                    <template v-slot:top-right>
                        <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="filtro.pendiente" dense
                            outlined>
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                        <q-btn @click="traerOcupacionPendiente" icon="refresh" color="fondo-s" text-color="black" />
                    </template>
                    <template v-if="seleccionados.length > 0" v-slot:top-left>
                        <q-btn @click="eliminarAsignacion" icon="delete" label="Eliminar" color="negative"
                            text-color="white" />
                    </template>
                </q-table>
            </q-tab-panel>
            <q-tab-panel style="height: 100%;" name="OrdenTerminadas" class="q-pa-sm">
                <q-table :dense="$q.screen.lt.md" rows-per-page-options="0" separator="cell"
                    style="width: 100%; height: 100%;" :filter="filtro.terminada" bordered title="Terminadas"
                    :rows="OcupacionTerminadas.rows" :columns="OcupacionTerminadas.columns" row-key="name">

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
                        <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="filtro.terminada" dense
                            outlined>
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                        <q-btn @click="traerOrdenesTerminadas" icon="refresh" color="fondo-s" text-color="black" />
                    </template>
                </q-table>
                <q-dialog v-model="isEvidencia">
                    <galeria-component :IsEditar="false" :IdOrdenEvidencia="IdEvidencia" />
                </q-dialog>
            </q-tab-panel>

        </q-tab-panels>

    </q-page>
</template>
<script setup>

import { ref, onMounted, watch } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import GaleriaComponent from "src/components/GaleriaComponent.vue";
const TramitesSinAsignar = ref({
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


const OcupacionPendiente = ref({rows: []})
const OcupacionTerminadas = ref({rows: []})
const usuarios = ref({})
const ventanaUsuarios = ref(false)
const seleccion = ref([])
const seleccionados = ref([])
const OrdenOcupacion = ref({})
const Ordenes = ref({})
const IdEvidencia = ref(0)
const filtro = ref({
    sinAsignar: '',
    pendiente: '',
    terminada: '',
})
const isEvidencia = ref(false)
const estadoTab = ref("SinAsignar")
const isTabla = ref(false)

TramitesSinAsignar.value.columns = [
    { align: "left", label: "Radicado", field: "Radicado", name: "Radicado" },
    { align: "left", label: "Código", field: "Matricula", name: "Matricula" },
    { align: "left", label: "Fecha", field: "Fecha", name: "Fecha", format: (val) => Utils.darFormatofecha(val) },
    { align: "left", label: "Usuario", field: "Tercero", name: "Tercero" },
    { align: "left", label: "Telefono", field: "Telefono", name: "Telefono" },
    { align: "left", label: "Barrio", field: "Barrio", name: "Barrio" },
    { align: "left", label: "Dirección", field: "Direccion", name: "Direccion" },
    { align: "left", label: "Creador Orden", field: "Usuario", name: "Usuario" },
    { align: "left", label: "Servicio", field: "Causante", name: "Causante" },
    { align: "left", label: "Tipo Instalación", field: "TipoInstalacion", name: "TipoInstalacion" },
    { align: "left", label: "Grupo", field: "Grupo", name: "Grupo" }

]

OcupacionPendiente.value.columns = [
    { align: "left", label: "Radicado", field: "Radicado", name: "Radicado" },
    { align: "left", label: "Código", field: "Matricula", name: "Matricula" },
    { align: "left", label: "Fecha", field: "Fecha", name: "Fecha", format: (val) => Utils.darFormatofecha(val) },
    { align: "left", label: "Usuario", field: "Usuario", name: "Usuario" },
    { align: "left", label: "Telefono", field: "Telefono", name: "Telefono" },
    { align: "left", label: "Barrio", field: "Barrio", name: "Barrio" },
    { align: "left", label: "Dirección", field: "Direccion", name: "Direccion" },
    { align: "left", label: "Creador Orden", field: "Supervisor", name: "Supervisor" },
    { align: "left", label: "Inspector", field: "Inspector", name: "Inspector" },
    { align: "left", label: "Servicio", field: "Causante", name: "Causante" },
    { align: "left", label: "Tipo Instalación", field: "TipoInstalacion", name: "TipoInstalacion" },
    { align: "left", label: "Grupo", field: "Grupo", name: "Grupo" }
]

OcupacionTerminadas.value.columns = [
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
    { align: "left", label: "Grupo", field: "Grupo", name: "Grupo" }
]


watch(() => estadoTab.value, (valorTab) => {
    switch (valorTab) {
        case 'SinAsignar':
            traerTramitesSinAsignar()
            break
        case 'OrdenPendientes':
            traerOcupacionPendiente()
            break
        case 'OrdenTerminadas':
            traerOrdenesTerminadas()
            break
    }
})
const traerTramitesSinAsignar = async () => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const response = await Api.get(`tramite/sinasignar/${IdUsuario}`)
        TramitesSinAsignar.value.rows = response.data
        isTabla.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
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
const traerOrdenesTerminadas = async () => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const response = await Api.get(`tramite/terminados/${IdUsuario}`)
        OcupacionTerminadas.value.rows = response.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
const traerOcupacionPendiente = async () => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const response = await Api.get(`tramite/pendientes/${IdUsuario}`)
        OcupacionPendiente.value.rows = response.data
        isTabla.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
const guardarCambios = async () => {

    Utils.loadingNotify(true, "Cargando usuarios")
    try {
        const response = await Api.get("usuario/listar")
        usuarios.value = response.data
        ventanaUsuarios.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }
}
const asignarTramite = async () => {
    if (!(await Utils.confirmarAccion("Seguro de realizar el registro"))) {
        return
    }

    Utils.loadingNotify(true, "asignando...")
    try {
        OrdenOcupacion.value.Tramites = seleccion.value
        OrdenOcupacion.value.IdUsuario = IdUsuario
        const response = await Api.post("tramite/asignar", OrdenOcupacion.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            ventanaUsuarios.value = false
            traerTramitesSinAsignar()
            seleccion.value = []
        }

        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
        Utils.loadingNotify(false, "")
    }

}
const eliminarTramite = async () => {
    if (!(await Utils.confirmarAccion("Seguro de eliminar los elementos marcados"))) {
        return
    }

    Utils.loadingNotify(true, "Eliminando...")
    try {
        Ordenes.value.Tramites = seleccion.value
        Ordenes.value.IdUsuario = IdUsuario
        const response = await Api.post("tramite/eliminar", Ordenes.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            traerTramitesSinAsignar()
            seleccion.value = []
        }

        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
        Utils.loadingNotify(false, "")
    }
}
const eliminarAsignacion = async () => {
    if (!(await Utils.confirmarAccion("Seguro de eliminar los elementos marcados"))) {
        return
    }

    Utils.loadingNotify(true, "Eliminando...")
    try {
        Ordenes.value.Ordenes = seleccionados.value
        Ordenes.value.IdUsuario = IdUsuario
        const response = await Api.post("tramite/ordenes/eliminar", Ordenes.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            ventanaUsuarios.value = false
            traerTramitesSinAsignar()
            traerOcupacionPendiente()
            seleccionados.value = []
        }

        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
        Utils.loadingNotify(false, "")
    }
}
const abrirModalEvidencia = async (idOrden) => {
    IdEvidencia.value = idOrden
    isEvidencia.value = true
}
onMounted(async () => {
    Utils.datoUsuario()
    .then(response => {
        IdUsuario = response.IdUsuario
        traerTramitesSinAsignar()
    })
    .catch(error => {
        console.log(error)
    })


})

</script>
