<template>
    <q-form @submit.prevent="registrarTercero">

        <div class="row q-col-gutter-sm">


            <q-input lazy-rules readonly  outlined class="col-xs-12 col-sm-4 col-md-2" square type="number"
                v-model="Tercero.IdTercero" label="Id">

                <template v-slot:prepend>
                    <q-icon name="person" />
                </template>
            </q-input>

            <q-select lazy-rules :rules="[Utils.regla]" :readonly="isTercero" option-label="Nombre"
                option-value="IdTipoIdentificacion" map-options emit-value class="col-xs-12 col-sm-8 col-md-5" outlined
                v-model="Tercero.IdTipoIdentificacion" :options="OpcionesSelect.Tercero.tipoidentificacion"
                label="Tipo Identificación">
                <template v-slot:prepend>
                    <q-icon name="date_range" />
                </template>
            </q-select>


            <q-input lazy-rules  outlined :rules="[Utils.regla]"
                class="col-xs-12 col-sm-12 col-md-5" square type="number" @blur="traerTercero"
                v-model="Tercero.Identificacion" :readonly="isTercero" label="Identificación">

                <template v-slot:prepend>
                    <q-icon name="account_box" />
                </template>
            </q-input>

        </div>



        <div class="row q-col-gutter-sm" v-if="!isEmpresa">

            <q-input :rules="[val => Utils.reglaBloqueada(val, isEmpresa)]" class="col-xs-12 col-sm-12 col-md-4"
                outlined type="text" lazy-rules v-model="Tercero.Nombres" label="Nombres">

                <template v-slot:prepend>
                    <q-icon name="person" />
                </template>
            </q-input>

            <q-input :rules="[val => Utils.reglaBloqueada(val, isEmpresa)]" class="col-xs-12 col-sm-12 col-md-8"
                outlined type="text" lazy-rules v-model="Tercero.Apellido1" label="Apellidos">

                <template v-slot:prepend>
                    <q-icon name="person" />
                </template>
            </q-input>




        </div>

        <!-- //Empresa -->
        <div class="row q-col-gutter-sm" v-if="isEmpresa">

            <q-select lazy-rules v-if="isEmpresa" :rules="[val => Utils.reglaBloqueada(val, isEmpresa)]"
                option-label="Nombre" option-value="IdTipoPersona" class="col-xs-12 col-sm-6 col-md-4   " square
                outlined map-options emit-value v-model="Tercero.IdTipoPersona"
                :options="OpcionesSelect.Tercero.tipopersona" label="Tipo persona">

                <template v-slot:prepend>
                    <q-icon name="date_range" />
                </template>
            </q-select>

            <q-input lazy-rules class="col-xs-12 col-sm-6 col-md-8"
                :rules="[val => Utils.reglaBloqueada(val, isEmpresa)]" outlined type="text"
                v-model="Tercero.RazonSocial" label="Razón Social">

                <template v-slot:prepend>
                    <q-icon name="domain" />
                </template>
            </q-input>

        </div>

        <div class="row q-col-gutter-sm">

            <q-input lazy-rules :rules="[val => val.length === 10 || 'Número no valido']"
                class="col-xs-12 col-sm-6 col-md-4" outlined type="number" v-model="Tercero.Telefono" label="Teléfono">

                <template v-slot:prepend>
                    <q-icon name="phone" />
                </template>
            </q-input>

            <q-input lazy-rules class="col-xs-12 col-sm-6 col-md-4" outlined type="email" v-model="Tercero.Correo"
                label="Correo">

                <template v-slot:prepend>
                    <q-icon name="email " />
                </template>
            </q-input>

            <div class="row col-xs-12 col-sm-16 col-md-4 justify-between">
                <q-btn style="height: 40px;" class="q-mr-sm" color="green" type="submit" size="md" label="Guardar" />
                <q-btn style="height: 40px;"  v-show="isTercero" color="red" @click="limpiarObjetoTercero()" size="md" label="Cancelar" />
            </div>



        </div>

    </q-form>
</template>



<script>
import { ref, watch } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import useCurrentTime from "src/components/useCurrentTime.js"



export default {
    props: {
        TercerProps: {
            type: Object
        }
    },
    setup(props) {

        watch(() => props.TercerProps, (newValue) => {
            Tercero.value = newValue
            isTercero.value = true
        })
        const Tercero = ref({})
        const isTercero = ref(false)
        const OpcionesSelect = ref({})
        OpcionesSelect.value.Tercero = {
            tipoidentificacion: [],
            tipopersona: [
                {
                    Nombre: "Persona natural",
                    IdTipoPersona: 1
                },
                {
                    Nombre: "Persona Juridica",
                    IdTipoPersona: 2
                },
            ]
        }

        const tiempoActual = ref()
        tiempoActual.value = useCurrentTime()


        const isEmpresa = ref(false)
        let IdUsuario
        Utils.datoUsuario()
            .then(response => {
                IdUsuario = response.IdUsuario
            })
            .catch(error => {
                console.log(error)
            })

        const traerTercero = async () => {

            if (Tercero.value.Identificacion != undefined) {
                if(isTercero.value){
                    return
                }
                if (Tercero.value.Identificacion.length > 3) {
                    try {
                        const response = await Api.get(`tercero/dni/${Tercero.value.Identificacion}`)
                        if (response.data.IsExito === false) {
                            Tercero.value.IdTercero = ''
                            isTercero.value = false
                            return
                        }
                        Tercero.value = response.data.Dato
                        isTercero.value = true
                    } catch (error) {
                        console.log(error)
                    }
                }


            }

        }
        const registrarTercero = async () => {
            if (!(await Utils.confirmarAccion("¿Esta seguro de realizar el registro?"))) {
                return;
            }
            if (Tercero.value.Telefono.length !== 10) {
                Utils.notificacion("El telefono debe contener 10 digitos")
                return
            }
            try {
                Tercero.value.IdUsuario = IdUsuario
                const response = await Api.post("tercero/", Tercero.value)
                if (response.data.IsExito !== false) {
                    limpiarObjetoTercero()
                }
                Utils.respuesta(response.data)
            } catch (error) {
                console.error("Error al registrarTercero", error)
            }
        }
        const traerConfiguracionFormularioTercero = async () => {
            const campos = ["tipoidentificacion"]

            for (const element of campos) {
                const response = await Api.get(`${element}`)
                OpcionesSelect.value.Tercero[element] = response.data
            }
        }
        const limpiarObjetoTercero = () => {
            Tercero.value = {}
            isTercero.value = false
        }


        watch(() => Tercero.value.IdTipoIdentificacion, (newValue) => {
            if (newValue === 2) {
                isEmpresa.value = true;
                Object.assign(Tercero.value, { Nombres: "", Apellido1: "", Apellido2: "" });
            }
            else {
                isEmpresa.value = false
            }
        }, { immediate: true })

        traerConfiguracionFormularioTercero()
        return {
            Tercero,
            isTercero,
            OpcionesSelect,
            tiempoActual,
            isEmpresa,
            traerTercero,
            Utils,
            registrarTercero,
            limpiarObjetoTercero
        }
    }
}


</script>