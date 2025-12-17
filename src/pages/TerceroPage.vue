<template>
    <q-page>

        <div class="col-xs-12 col-sm-6 col-md-6 bg-grey-8 row q-pa-sm justify-between items-center q-mb-md">
            <span class="row items-center">
                <q-icon name="work" size="xs" color="grey-2" class="q-mr-sm" />
                <p class="q-ma-none text-grey-2">Tercero</p>
            </span>

            <q-btn @click="listarTerceros" size="sm" color="fondo-s" text-color="blue-8" icon="group" />
        </div>

        <tercero-component :TercerProps="tercero" class="q-pa-sm" />

        <q-dialog v-model="ventanaTerceros">


            <q-card style="max-width: 90vh; width: 800px; height: 500px;">
                <q-card-section style="height: 50px;" class="bg-blue-9 row items-center justify-center text-white">
                    <div class="text-h6">Terceros</div>
                </q-card-section>
                <q-separator />
                <q-scroll-area style="height: 449px">

                    <q-table :dense="$q.screen.lt.md" :rows-per-page-options="[10, 25, 50, 100]" class="col-xs-12"
                        :filter="filter" :rows="datosTabla.rows" :columns="datosTabla.columns">
                        <template v-slot:top-right>
                            <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                                <template v-slot:append>
                                    <q-icon name="search"></q-icon>
                                </template>
                            </q-input>
                        </template>
                        <template v-slot:top-left>
                            <p class="text-weight-medium q-ma-none">
                                Lista de terceros
                            </p>
                        </template>
                        <template v-slot:body-cell-Editar="props">
                            <q-td :props="props">
                                <q-btn color="purple-8" size="sm" rounded icon="edit"
                                    @click="traerTercero(props.row.IdTercero)" />
                            </q-td>
                        </template>
                    </q-table>

                </q-scroll-area>
            </q-card>

        </q-dialog>

    </q-page>
</template>

<script setup>
import { ref } from "vue"
import TerceroComponent from "src/components/TerceroComponent.vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils"

const ventanaTerceros = ref(false)
const filter = ref('')
const datosTabla = ref({rows: []})
const tercero = ref({})

const listarTerceros = async () => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const response = await Api.get("tercero")
        datosTabla.value.rows = response.data
        ventanaTerceros.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        Utils.notificacion(false, error)
    }

}
const traerTercero = async (id) => {

    Utils.loadingNotify(true, 'Cargando tercero')
    try {
        Utils.loadingNotify(false, '')
        const response = await Api.get(`tercero/${id}`);
        tercero.value = response.data
        ventanaTerceros.value = false

    } catch (error) {
        console(error)
    }

}

datosTabla.value.columns = [
    { align: 'left', name: "NombreCompleto", field: "NombreCompleto", label: "NombreCompleto" },
    { align: 'left', name: "Identificacion", field: "Identificacion", label: "Identificacion" },
    { align: 'left', name: "Telefono", field: "Telefono", label: "Telefono" },
    { align: 'left', name: "Editar", field: "Editar", label: "Editar" }
]



</script>