<template>
    <q-page class="full-height justify-center row items-center">

        <q-card class="column " style="width: 500px; max-width: 90%; height: 450px;">
            <q-toolbar class="q-mb-md bg-blue-8 text-white">
                <q-toolbar-title>
                    Cambiar Contraseña
                </q-toolbar-title>
            </q-toolbar>

            <q-form @submit.prevent="enviarCambios" class="column col q-pa-md">
                <q-input class="q-mb-md" label="Contraseña Anterior" lazy-rules :rules="[Utils.regla]" filled
                    v-model="Usuario.ClaveAnterior">
                    <template v-slot:prepend>
                        <q-icon name="password" />
                    </template>
                </q-input>
                <q-input class="q-mb-md" label="Nueva contraseña" lazy-rules :rules="[Utils.regla]" filled
                    v-model="Usuario.Clave">

                    <template v-slot:prepend>
                        <q-icon name="password" />
                    </template>
                </q-input>
                <q-input class="q-mb-md" label="Confirmar Contraseña" lazy-rules :rules="[Utils.regla]" filled
                    v-model="Usuario.verifyPassword">

                    <template v-slot:prepend>
                        <q-icon name="password" />
                    </template>
                </q-input>
                <div class="col row items-center">
                    <q-btn class="full-width" type="submit" label="Confirmar cambios" color="blue-8" />
                </div>

            </q-form>

        </q-card>

    </q-page>
</template>

<script setup>

import { Notify } from "quasar"
import Utils from "src/utils/Utils"
import Api from "src/services/Api.vue"
import { reactive, ref, watch } from "vue"

let Usuario = ref({})

Utils.datoUsuario()
    .then(response => {
        Usuario.value.IdUsuario = response.IdUsuario
    })



const enviarCambios = async () => {
    Object.assign(Usuario, {})
    if (Usuario.value.verifyPassword !== Usuario.value.Clave) {
        Notify.create({
            type: 'negative',
            message: 'Las contraseñas no coinciden'
        })
        return
    }
    if (!(await Utils.confirmarAccion("Seguro de cambiar la contraseña ?"))) {
        return
    }
    const response = await Api.post("usuario/clave", Usuario.value)
    Utils.respuesta(response.data)
    if (response.data.IsExito == true) {
        Usuario.value = {}
    }
}

</script>