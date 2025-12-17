<template>
    <q-page class="full-height" style="overflow: auto">

        <div class="col-xs-12 col-sm-6 col-md-6 bg-grey-8 row q-pa-sm justify-between items-center q-mb-md">
            <span class="row items-center">
                <q-icon name="work" size="xs" color="grey-2" class="q-mr-sm" />
                <p class="q-ma-none text-grey-2">Tramites</p>
            </span>
            <div class="row  items-center" style="height: 41px;column-gap: 15px;">
                <q-btn @click="ListarTramites" icon="description" size="sm" color="white" text-color="blue" />
                <q-btn v-if="IdRol === 1 || IdRol === 2" @click="ListarTodosTramites" icon="edit_note" size="sm"
                    color="white" text-color="blue" />

                <q-file v-if="IdRol === 1 || IdRol === 2" class="q-ma-none" accept=".xls,.xlsx" bg-color="green"
                    outlined v-model="ExcelImporteMasivo" style="color: white;" label="Cargar Excel" dense />

                <q-btn dense color="white" size="sm" text-color="green" label="Importar"
                    v-if="IdRol === 1 || IdRol === 2" icon="save" @click="GuardarExcel" />

                <q-btn dense color="white" size="sm" text-color="green" label="Descargar Plantilla"
                    v-if="IdRol === 1 || IdRol === 2" icon="download" @click="descargarPlantilla" />

            </div>

        </div>


        <q-form v-show="!isListar" @submit.prevent="guardarTramite">

            <div class="q-ma-sm row q-col-gutter-sm">

                <q-input readonly lazy-rules class="col-xs-12 col-sm-6 col-md-3" outlined type="email"
                    v-model="Tramite.Radicado" label="Radicado">

                    <template v-slot:prepend>
                        <q-icon name="tag" />
                    </template>
                </q-input>

                <q-input readonly lazy-rules class="col-xs-12 col-sm-6 col-md-3" outlined type="email"
                    v-model="Tramite.FechaCreacion" label="Fecha Radicado">

                    <template v-slot:prepend>
                        <q-icon name="date_range " />
                    </template>
                </q-input>

                <q-input @blur="isEstadoServicio = false" :rules="[Utils.regla]" class="col-xs-12 col-sm-6 col-md-3"
                    outlined type="number" lazy-rules v-model="Tramite.Matricula" label="Código">

                    <template v-slot:prepend>
                        <q-icon name="description" />
                    </template>
                </q-input>

                <q-select @update:model-value="isEstadoServicio = false" lazy-rules outlined option-label="Nombre"
                    option-value="IdDistribuidora" :rules="[Utils.regla]" class="col-xs-12 col-sm-6 col-md-3"
                    map-options emit-value :options="OpcionesSelect.Tramite.distribuidora" square
                    v-model="Tramite.IdDistribuidora" label="Distribuidora">
                    <template v-slot:prepend>
                        <q-icon name="store" />
                    </template>
                </q-select>


            </div>
            <div class="q-ma-sm row q-col-gutter-sm">

                <q-select @update:model-value="isEstadoServicio = false" lazy-rules outlined option-label="Nombre"
                    option-value="IdTipoGas" :rules="[Utils.regla]" class="col-xs-12 col-sm-6 col-md-3 " map-options
                    emit-value :options="OpcionesSelect.Tramite.tipogas" square v-model="Tramite.IdTipoGas"
                    label="Tipo Gas">
                    <template v-slot:prepend>
                        <q-icon name="gas_meter" />
                    </template>
                </q-select>

                <q-select :readonly="isSerial" @update:model-value="isEstadoServicio = false" lazy-rules outlined
                    option-label="Nombre" option-value="IdTipoServicio" :rules="[Utils.regla]"
                    class="col-xs-12 col-sm-6 col-md-3 " map-options emit-value
                    :options="OpcionesSelect.Tramite.tiposervicio" square v-model="Tramite.IdTipoServicio"
                    label="Tipo Servicio">
                    <template v-slot:prepend>
                        <q-icon name="build" />
                    </template>
                </q-select>


                <q-select @update:model-value="isEstadoServicio = false" lazy-rules outlined option-label="Nombre"
                    option-value="IdTipoInstalacion" :rules="[Utils.regla]" class="col-xs-12 col-sm-6 col-md-3 "
                    map-options emit-value :options="OpcionesSelect.Tramite.tipoinstalacion" square
                    v-model="Tramite.IdTipoInstalacion" label="Tipo Instalación">
                    <template v-slot:prepend>
                        <q-icon name="settings" />
                    </template>
                </q-select>


                <q-input lazy-rules class="col-xs-12 col-sm-6 col-md-3" outlined type="text" v-model="Tramite.Barrio"
                    label="Barrio">

                    <template v-slot:prepend>
                        <q-icon name="store" />
                    </template>
                </q-input>



            </div>
            <div class="q-ma-sm row q-col-gutter-sm">
            
                <q-input lazy-rules @blur="filtrarTercero" class="col-xs-12 col-sm-6 col-md-3" outlined :rules="[Utils.regla]" type="number"
                    v-model="Tramite.Tercero.Identificacion" label="Identificacion">
                    <template v-slot:prepend>
                        <q-icon name="person" />
                    </template>
                </q-input>

                <q-input class="col-xs-12 col-sm-6 col-md-3" :rules="[Utils.regla]" lazy-rules outlined type="text"
                    v-model="Tramite.Tercero.Nombres" label="Nombres">

                    <template v-slot:prepend>
                        <q-icon name="person" />
                    </template>
                </q-input>

                <q-input lazy-rules :rules="[Utils.regla]" class="col-xs-12 col-sm-6 col-md-3" outlined type="text"
                    v-model="Tramite.Tercero.Apellido1" label="Apellidos">

                    <template v-slot:prepend>
                        <q-icon name="person" />
                    </template>
                </q-input>


                <q-input lazy-rules :rules="[Utils.regla]" class="col-xs-12 col-sm-6 col-md-3" outlined type="text"
                    v-model="Tramite.Tercero.Telefono" label="Telefono">

                    <template v-slot:prepend>
                        <q-icon name="phone" />
                    </template>
                </q-input>
            </div>

            <div class="q-ma-sm row q-col-gutter-sm">


                <q-select lazy-rules :rules="[Utils.regla]" option-label="Nombre" option-value="IdDepartamento"
                    class="col-xs-12 col-sm-12 col-md-4" transition-show="jump-up" transition-hide="jump-up" square
                    outlined map-options emit-value v-model="Tramite.IdDepartamento"
                    :options="OpcionesSelect.departamento" label="Departamento">

                    <template v-slot:prepend>
                        <q-icon name="apartment" />
                    </template>
                </q-select>

                <q-select lazy-rules :rules="[Utils.regla]" option-label="Nombre" option-value="IdMunicipio"
                    class="col-xs-12 col-sm-12 col-md-4 " map-options emit-value
                    :options="OpcionesSelect.Tramite.municipio" square outlined v-model="Tramite.IdMunicipio"
                    label="Municipio">

                    <template v-slot:prepend>
                        <q-icon name="location_city" />
                    </template>
                </q-select>

                <q-input :rules="[Utils.regla]" class="col-xs-12 col-sm-12 col-md-4" outlined type="text" lazy-rules
                    v-model="Tramite.Direccion" label="Dirección">

                    <template v-slot:prepend>
                        <q-icon name="location_city" />
                    </template>
                </q-input>

                <q-input v-if="isSerial" :rules="[val => Utils.reglaBloqueada(val, !isSerial)]"
                    class="col-xs-12 col-sm-12 col-md-4" outlined type="text" lazy-rules v-model="Tramite.Serial"
                    label="Serial Medidor">

                    <template v-slot:prepend>
                        <q-icon name="description" />
                    </template>
                </q-input>

                <q-input bg-color="orange-3" v-if="isSerial" :rules="[val => Utils.reglaBloqueada(val, !isSerial)]"
                    class="col-xs-12 col-sm-12 col-md-4" outlined type="text" lazy-rules v-model="Tramite.NumeroInforme"
                    label="Numero Informe">

                    <template v-slot:prepend>
                        <q-icon name="description" />
                    </template>
                </q-input>

            </div>

            <div class="row">
                <q-btn type="submit" class="q-mt-md q-mb-md q-ml-md" label="Guardar" color="green" />
                <q-btn @click="limpiarObjetoTramite" class="q-mt-md q-mb-md q-ml-md" label="Limpiar" color="blue-8" />
            </div>

        </q-form>


        <q-table class="q-ma-sm" v-show="isListar" :filter="filtroTramite" :dense="$q.screen.lt.md"
            style="height: calc(100% - 90px);" separator="horizontal" :rows-per-page-options="[0]"
            :columns="tramites.columns" :rows="tramites.rows">
            <template v-slot:body-cell-Editar="props">
                <q-td :props="props">
                    <q-btn color="orange-8" size="sm" icon="edit" @click="traerTramiteXId(props.row.IdTramite)" />
                </q-td>
            </template>

            <template v-slot:top-right>
                <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="filtroTramite" dense outlined>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn color="red" icon="close" @click="isListar = false" />
            </template>
            <template v-slot:top-left>
                <p class="q-ma-none">Tramites</p>
            </template>

        </q-table>



    </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils.js"
import TerceroComponent from "src/components/TerceroComponent.vue"

const Tramite = ref({ Serial: null, Tercero: {} })
const isListar = ref(false)
const tramites = ref({rows: []})
const ExcelImporteMasivo = ref(null)
const filtroTramite = ref('')
const isSerial = ref(false)
tramites.value.columns = [
    { align: "left", label: "Editar", field: "Editar", name: "Editar" },
    { align: "left", label: "Código", field: "Matricula", name: "Matricula" },
    { align: "left", label: "Radicado", field: "Radicado", name: "Radicado" },
    { align: "left", label: "Fecha", field: "Fecha", name: "Fecha", format: (val) => Utils.darFormatofecha(val) },
    { align: "left", label: "Usuario", field: "Tercero", name: "Tercero" },
    { align: "left", label: "Barrio", field: "Barrio", name: "Barrio" },
    { align: "left", label: "Direccion", field: "Direccion", name: "Direccion" },
    { align: "left", label: "Inspector", field: "Usuario", name: "Usuario" },
    { align: "left", label: "Servicio", field: "Servicio", name: "Servicio" },
    { align: "left", label: "Grupo", field: "Grupo", name: "Grupo" },
    { align: "left", label: "Serial Medidor", field: "Serial", name: "Serial" },

]

const agregarTercero = ref(false)
const OpcionesSelect = ref({})
OpcionesSelect.value.Tramite = {}
const terceros = ref([])
let IdUsuario
let IdRol = ref(null)


onMounted(async () => {

    Utils.datoUsuario()
        .then(response => {
            IdUsuario = response.IdUsuario
            IdRol.value = response.IdRol
        })
        .catch(error => {
            console.log(error)
        })

})



const traerConfiguracionFormularioTramite = async () => {
    Utils.loadingNotify(true, "Cargando...")
    try {
        const campos = ["tipogas", "tiposervicio", "tipoinstalacion", "distribuidora"]

        for (const element of campos) {
            const response = await Api.get(`tramite/${element}`)
            OpcionesSelect.value.Tramite[element] = response.data
        }
        const responseD = await Api.get("departamento")
        OpcionesSelect.value.departamento = responseD.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        Utils.loadingNotify(false, "")
        Utils.notificacion("Tiempo agotado, vuelva a intentarlo", false)
    }

}
const guardarTramite = async () => {
    if (!(await Utils.confirmarAccion("Seguro de realizar el registro ?"))) {
        return
    }
    Tramite.value.IdUsuario = await IdUsuario
    Utils.loadingNotify(true, "Guardando")
    try {
        const response = await Api.post("tramite", Tramite.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            limpiarObjetoTramite()
        }
        Utils.loadingNotify(false, "")
    } catch (error) {
        Utils.notificacion("Ocurrio algo inesperado", false)
        Utils.loadingNotify(false, "")
    }

}


const GuardarExcel = async (val) => {

    if (ExcelImporteMasivo.value === null) {
        Utils.notificacion("Debe cargar el excel", false)
        return
    }
    if (!(await Utils.confirmarAccion("Seguro de realizar la importación?"))) {
        return
    }
    Utils.loadingNotify(true, "Importando excel")
    try {

        const formData = new FormData();
        formData.append("excel", ExcelImporteMasivo.value)
        formData.append("IdUsuario", IdUsuario)

        const response = await Api.post("tramite/importemasivo", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        Utils.loadingNotify(false)

        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            ExcelImporteMasivo.value = null
        }

    } catch (error) {
        Utils.loadingNotify(false)
        Utils.notificacion(error, false)
    }
}
const descargarPlantilla = async () => {

    if (!(await Utils.confirmarAccion("Seguro de descargar la plantilla de importe ?"))) {
        return
    }
    try {
        const link = document.createElement('a')
        link.href = 'PlantillaImporteTramite.xlsx'
        link.download = 'PlantillaImporteTramiteServiGas'
        link.click()
    } catch (error) {
        console.error('Error al descargar el archivo:', error)
    }
}

const limpiarObjetoTramite = async () => {
    Tramite.value = {}
    Tramite.value.Tercero = {}
    isListar.value = false
    isSerial.value = false
}
const traerTramiteXId = async (idtramite) => {
    const response = await Api.get(`tramite/${idtramite}`)
    Tramite.value = response.data
    if (response.data.Serial !== null) {
        isSerial.value = true
    } else {
        isSerial.value = false
    }
    Tramite.value.FechaCreacion = Utils.darFormatofecha(Tramite.value.FechaCreacion)

    isListar.value = false
}
const ListarTramites = async () => {
    Utils.loadingNotify(true, "Cargando..")
    try {
        const response = await Api.get(`tramite/asignados/${IdUsuario}`)
        tramites.value.rows = response.data
        isListar.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        Utils.loadingNotify(false, "")
        Utils.notificacion(error, false)
    }

}
const ListarTodosTramites = async () => {
    Utils.loadingNotify(true, "Cargando..")
    try {
        const response = await Api.get(`tramite/usuario/${IdUsuario}`)
        tramites.value.rows = response.data
        isListar.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        Utils.loadingNotify(false, "")
        Utils.notificacion(error, false)
    }

}

watch(() => Tramite.value.IdDepartamento, async (newValue) => {
    if (newValue !== undefined) {
        const response = await Api.get(`departamento/${newValue}/municipio`)
        Tramite.value.IdMunicipio = ''
        return OpcionesSelect.value.Tramite.municipio = response.data;
    }
}, { immediate: true })

watch(() => ExcelImporteMasivo.value, async (newValue, oldValue) => {

    ExcelImporteMasivo.value = newValue
})

const filtrarTercero = async () => {

    try {
        const response = await Api.get(`tercero/dni/${Tramite.value.Tercero.Identificacion}`);
        if (response.data.IsExito) {
            Tramite.value.Tercero = response.data.Dato
        }else{
            Tramite.value.Tercero.IdTercero = 0
        }

    } catch (error) {
        console.log(error);
    }
}



traerConfiguracionFormularioTramite()

</script>
