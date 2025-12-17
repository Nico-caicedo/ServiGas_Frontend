<template>
    <q-page class="q-pa-sm full-height">

        <header class="column justify-between q-pt-sm" style="border: 2px solid #ddd ;border-radius: 5px; height: 230px;">

            <span class="self-center text-center q-pa-sm text-white" style="border-radius: 15px;" :style="{ backgroundColor: `${grupoTrabajo.Color}` }">
                <q-icon name="admin_panel_settings" :color="grupoTrabajo.Color" size="xl" />
                <p class="text-h7 q-ma-none">JEFE</p>
                <p class="text-h7">{{ grupoTrabajo.Tercero.NombreCompleto }}</p>
            </span>

            <div :style="{ backgroundColor: `${grupoTrabajo.Color}` }" style="border-radius: 5px; height: 50px;"
                class="full-width text-center row items-center justify-center">
                <p class="q-ma-none text-h6 text-white text-center">{{ grupoTrabajo.Nombre }}</p>
            </div>

        </header>

        <div style="height: calc(100% - 230px); overflow: auto; width: 100%;">
            <q-toolbar style="position: sticky; top: 0; z-index: 3;"  class="bg-grey-8 text-white shadow-2">
                <q-toolbar-title>Trabajadores</q-toolbar-title>
                <q-icon name="groups" size="md"/>
            </q-toolbar>

            <q-list bordered style="width: 100%;" v-if="grupoTrabajo.IdGrupoTrabajo > 0">

                <q-item v-for="tercero in grupoTrabajo.Terceros" :key="tercero.IdTercero" class="q-my-sm" clickable
                    v-ripple>
                    <q-item-section avatar>
                        <q-icon name="person" color="blue-8"/>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ tercero.NombreCompleto }}</q-item-label>
                        <q-item-label>{{ tercero.Identificacion }}</q-item-label>
                    </q-item-section>

                </q-item>

                <q-separator />
            </q-list>
        </div>
    </q-page>
</template>

<script setup>

import { Notify } from "quasar"
import Utils from "src/utils/Utils"
import Api from "src/services/Api.vue"
import { onMounted, ref } from "vue"

let Usuario = ref({})
const grupoTrabajo = ref({Tercero: {}})



const traerGrupoXIdJefe = async () => {

    Utils.loadingNotify(true, "Cargando información")
    try {
        const response = await Api.get(`usuario/grupo/jefe/${Usuario.value.IdUsuario}`)
        grupoTrabajo.value = response.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }
}

onMounted(async () => {
    Utils.datoUsuario()
        .then(response => {
            Usuario.value.IdUsuario = response.IdUsuario
            traerGrupoXIdJefe()
        })
})
</script>