<template>
    <q-page class="full-height" style="display: flex;flex-direction: column;">

        <span class="col-xs-12 bg-grey-8 items-center col-sm-6 col-md-6 row q-pa-sm justify-between">
            <span class="row">
                <p class="q-ma-none text-grey-2 text-subtitle-2">Permisos</p>
            </span>
        </span>

        <section class="galeriaResponsive col">

            <q-card class="galeria_button" style="border: 1px solid #ddd; box-shadow: none;">

                <div @click="traerTerceros()" class="cursor-pointer  justify-between column"
                    style="border-radius: 15px;grid-column: span 2; background-color: #84B6F4;">
                    <div class="row justify-between q-pa-sm">
                        <p class="q-ma-none text-h6 text-center text-grey-1">Usuario</p>
                        <q-icon size="sm" color="grey-3" style="border-radius: 10px; background-color: rgb(0 0 0 / 10%)"
                            class="self-end q-pa-sm" name="person" />
                    </div>

                    <span class="self-center items-center justify-center row self-end full-width"
                        style="height: 45px; background-color: rgb(0 0 0 / 10%)">
                        <p class="q-ma-none subtitle-2 text-grey-2 text-center">Crea un usuario a partir de un tercero
                        </p>
                    </span>
                </div>

                <div @click="abrirVentana()" class="cursor-pointer justify-between column"
                    style="border-radius: 15px;grid-column: span 2;background-color: #FF6961;">
                    <div class="row justify-between q-pa-sm">
                        <p class="q-ma-none text-h6 text-center text-grey-1">Grupo de trabajo</p>
                        <q-icon size="sm" color="grey-3" style="border-radius: 10px; background-color: rgb(0 0 0 / 10%)"
                            class="self-end q-pa-sm" name="groups" />
                    </div>

                    <span class="self-center items-center justify-center row self-end full-width"
                        style="height: 45px; background-color: rgb(0 0 0 / 10%)">
                        <p class="q-ma-none subtitle-2 text-grey-2 text-center">Crea un Grupo de trabajo y asigna un
                            supervisor e
                            inspectores</p>
                    </span>
                </div>

            </q-card>
            <q-card style="grid-row: span 2; border: 1px solid #ddd; box-shadow: none;">

                <q-list bordered class="rounded-borders" style="overflow: auto;">
                    <q-item-label header>Usuarios</q-item-label>

                    <template v-for="(usuario, index ) in usuarios" :key="index">

                        <q-item @click="actualizarRol(usuario)" clickable>
                            <q-item-section avatar top>
                                <q-avatar icon="person" color="primary" text-color="white" />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="q-mt-sm">{{ usuario.NombreCompleto }}</q-item-label>
                                <q-item-label caption>{{ usuario.Identificacion }}</q-item-label>
                                <q-item-label caption>{{ usuario.Rol }}</q-item-label>
                                <q-item-label class="text-blue-5" caption>{{ usuario.RolEmpleado }} {{ usuario.Grupo
                                    }}</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-icon name="circle" :color="usuario.IsEstado ? 'green' : 'red'" />
                                {{ usuario.IsEstado ? 'Activo' : 'Inactivo' }}
                            </q-item-section>
                        </q-item>

                        <q-separator spaced />
                    </template>

                </q-list>
            </q-card>
            <q-card style="border: 1px solid #ddd; box-shadow: none;">
                <p class="q-ma-xs q-ma-none q-mt-sm q-ml-sm text-grey-7">Vistas por rol</p>
                <div class="row col-md-12 q-pa-sm">
                    <q-select option-label="Nombre" option-value="IdRol"
                        @update:model-value="val => traerVistasXrol(val)" lazy-rules map-options emit-value
                        class="q-mb-md col-xs-12 col-sm-6 col-md-12" outlined v-model="rol" :options="opcionesRol"
                        label="Rol">
                        <template v-slot:prepend>
                            <q-icon name="work" />
                        </template>
                    </q-select>

                    <q-btn style="height: 40px;" @click="actualizarVistas" label="Actualizar" icon="save"
                        color="blue-8" />
                </div>
                <q-tree color="blue-8" v-if="cargado" class="col" :nodes="formatearMenus(menus)" v-model:ticked="vistas"
                    v-model:expanded="expanded" default-expand-all node-key="label" tick-strategy="leaf" />


            </q-card>

        </section>

        <q-dialog v-model="ventanaUsuarios">
            <q-card class="my-card q-pb-md" style="width: 500px; max-width: 100vh; height: 300px;">
                <q-card-section class="bg-blue-8 text-white q-pa-none" style="height: 40px;">
                    <div class="text-h6 text-center">Terceros sin rol</div>
                </q-card-section>

                <q-separator />

                <q-card-actions class="row q-col-gutter-xs">


                    <q-select option-label="NombreCompleto" option-value="IdTercero" lazy-rules map-options emit-value
                        class="q-mb-md col-xs-12 col-sm-12 col-md-12" outlined v-model="Usuario.IdTercero"
                        :options="terceros" label="Terceros">
                        <template v-slot:prepend>
                            <q-icon name="person" />
                        </template>
                    </q-select>


                    <q-select option-label="Nombre" option-value="IdRol" lazy-rules map-options emit-value
                        class="q-mb-md col-xs-12 col-sm-12 col-md-12" outlined v-model="Usuario.IdRol"
                        :options="opcionesRol" label="Rol">
                        <template v-slot:prepend>
                            <q-icon name="work" />
                        </template>
                    </q-select>

                    <q-btn class="full-width self-end" @click="crearUsuario" label="Guardar" color="fondo-p" />

                </q-card-actions>
            </q-card>
        </q-dialog>

        <template v-if="ventanaGestionGrupo">

            <section class="bg-white full-height full-width absolute-left " style="z-index: 3;">

                <q-bar class="fondo-p row justify-between" style="height: 45px;">
                    <p class="q-ma-none text-white" style="font-size: 13.5px;">Gestión de grupos</p>
                    <q-btn @click="ventanaGestionGrupo = false" dense flat icon="close" class="text-white" />
                </q-bar>
                <div class="row" style="overflow: auto; height: calc(100% - 45px);">

                    <q-form @submit.prevent="guardarGrupoTrabajo"
                        class="row q-col-gutter-sm q-pa-sm  col-xs-12 col-sm-12 col-md-12">

                        <div class="col-sm-12 col-xs-12 col-md-5" style="overflow: auto;">


                            <q-input rounded lazy-rules filled readonly class="q-mb-md col-xs-12 col-sm-12 col-md-12"
                                type="number" v-model="grupoTrabajo.IdGrupoTrabajo" label="Id">

                                <template v-slot:prepend>
                                    <q-icon name="key" />
                                </template>
                            </q-input>


                            <q-input rounded lazy-rules filled :rules="[Utils.regla]"
                                class="col-xs-12 col-sm-12 col-md-12" type="text" v-model="grupoTrabajo.Nombre"
                                label="Nombre del grupo">

                                <template v-slot:prepend>
                                    <q-icon name="groups" />
                                </template>
                            </q-input>

                            <q-select :readonly="grupoTrabajo.IdGrupoTrabajo > 0" rounded :rules="[Utils.regla]"
                                lazy-rules use-input map-options filled v-model="grupoTrabajo.Tercero" label="Jefe"
                                option-label="NombreCompleto" color="blue-8" bg-color="grey-3" :options="terceros"
                                @filter="filtrarSupervisor" class="col-xs-12 col-sm-11 col-md-11">
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
                                            <q-item-label caption>{{ scope.opt.Rol }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>

                            <p class="text-subtitle-2">Seleccione un color</p>
                            <input class="col-xs-12 col-sm-11 col-md-12 cursor-pointer"
                                style="height: 40px;width: 100%; border: none;" hint="sas" type="color"
                                v-model="grupoTrabajo.Color" />

                            <q-btn type="submit" label="Guardar" class="q-mb-sm q-mr-sm q-mt-md " color="green-8"
                                text-color="white" />
                            <q-btn type="button" label="Limpiar" @click="limpiarCampos" class="q-mb-sm q-mt-md "
                                color="blue-8" text-color="white" />

                            <div class="row justify-around " style="flex-wrap: wrap; gap: 5px;">

                                <template v-for="(card, index) in gruposTrabajo" :key="index">
                                    <div @click="traerGrupoXId(card.IdGrupoTrabajo)"
                                        style="max-width: 250px; flex: 1; border-radius: 5px;"
                                        class="cursor-pointer q-pa-sm column items-center row justify-center text-center text-grey-3"
                                        :style="{ backgroundColor: `${card.Color}` }">
                                        <q-icon name="groups" size="md" />
                                        <p class="text-subtitle-1">{{ card.Nombre }}</p>
                                        <p class="text-subtitle-1">Lider: {{ card.Jefe }}</p>
                                    </div>
                                </template>


                            </div>

                        </div>

                        <div style="height: 100%; display: flex; overflow: hidden; flex-direction: column;"
                            class="col-sm-12 col-xs-12 col-md-7">

                            <div class="row" style="flex: 1;">
                                <q-table style="height: 250px; max-height: 260px;" dense :rows-per-page-options="[0]" separator="cell" :filter="Filtro"
                                    title="Inspectores Sin grupo" class="col"  :rows="UsuariosGrupo.rows"
                                    :columns="UsuariosGrupo.columns" selection="multiple" row-key="IdUsuario"
                                    v-model:selected="seleccionados">

                                    <template v-slot:top-right>
                                        <q-input label="Buscar" class="bg-white text-black q-mr-sm" v-model="Filtro"
                                            dense outlined>
                                            <template v-slot:append>
                                                <q-icon name="search" />
                                            </template>
                                        </q-input>
                                    </template>
                                </q-table>
                            </div>


                            <div style="flex: 1; overflow: hidden; flex-wrap: nowrap;" class="column">

                                <q-toolbar class="bg-primary text-white shadow-2">
                                    <q-toolbar-title>Trabajadores</q-toolbar-title>
                                </q-toolbar>
                             
                                <q-list bordered v-if="grupoTrabajo.IdGrupoTrabajo > 0"
                                    style="overflow: auto; height: 250px;">
                                    

                                    <q-item v-for="tercero in grupoTrabajo.Terceros" :key="tercero.IdTercero"
                                        class="q-my-sm" clickable v-ripple>
                                        <q-item-section avatar>
                                            <q-icon name="person" />
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label>{{ tercero.NombreCompleto }}</q-item-label>
                                            <q-item-label>{{ tercero.Identificacion }}</q-item-label>
                                        </q-item-section>

                                        <q-item-section side>
                                            <q-icon name="delete" @click="eliminarUsuarioGrupo(tercero.IdUsuario)"
                                                color="red" />
                                        </q-item-section>
                                    </q-item>

                                    <q-separator />
                                </q-list>



                            </div>

                        </div>

                    </q-form>

                </div>

            </section>

        </template>

        <q-dialog v-model="ventanaActualizarRol">

            <q-card class="my-card q-pb-md">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Seleccione rol</div>
                </q-card-section>

                <q-separator />

                <q-card-actions class="row">

                    <q-select option-label="Nombre" option-value="IdRol" lazy-rules map-options emit-value
                        class="q-mb-md col-xs-12 col-sm-12 col-md-12" filled v-model="UsuarioA.IdRol"
                        :options="opcionesRol" label="Rol">
                        <template v-slot:prepend>
                            <q-icon name="work" />
                        </template>
                    </q-select>

                    <q-btn class="full-width" @click="guardarActualizarUsuario" label="Guardar" color="fondo-p" />

                </q-card-actions>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue"
import Api from "src/services/Api.vue"
import Utils from "src/utils/Utils"


const vistas = ref([])
const expanded = ref()
const menus = ref({})
const grupoTrabajo = ref({ Color: '#019a9d' })

const opcionesRol = ref([])
const usuarios = ref({})
const rol = ref()
const cargado = ref(false)
const ventanaUsuarios = ref(false)
const ventanaActualizarRol = ref(false)
const ventanaGestionGrupo = ref(false)
const terceros = ref([])
const UsuariosGrupo = ref(  {rows: []})
const Filtro = ref('')
const seleccionados = ref([])
const Usuario = ref({
    IdTercero: '',
    IdRol: ''
})
const UsuarioA = ref({})
const gruposTrabajo = ref({})
const limpiarCampos = async () => {
    grupoTrabajo.value = {}
}
const traerRols = async () => {
    Utils.loadingNotify(true, 'Cargando información..')
    try {
        const response = await Api.get(`rol`)
        opcionesRol.value = response.data
        Utils.loadingNotify(false, '')
    } catch (error) {
        console.log(error)
    }
}
const crearUsuario = async () => {

    if (Usuario.value.IdTercero === '') {
        Utils.notificacion("Selecciona un tercero")
        return
    }
    if (Usuario.value.IdRol === '') {
        Utils.notificacion("Selecciona un rol")
        return
    }
    if (!(await Utils.confirmarAccion("Seguro de realizar registro?"))) {
        return
    }
    Utils.loadingNotify(true, "Creando usuario")
    try {
        const response = await Api.post("usuario", Usuario.value)
        ventanaUsuarios.value = false
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            traerUsuarios()
            Usuario.value.IdTercero = ''
            Usuario.value.IdRol = ''
        }
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }
}
const traerTerceros = async () => {
    Utils.loadingNotify(true, "Cargando terceros")
    try {
        const response = await Api.get("tercero/list")
        terceros.value = response.data
        ventanaUsuarios.value = true
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
const traerUsuarios = async () => {

    Utils.loadingNotify(true, "Cargando usuarios")
    try {
        const response = await Api.get("usuario/listar")
        usuarios.value = response.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }

}
const traerVistasXrol = async (idRol) => {
    Utils.loadingNotify(true, "Cargando vistas")
    try {
        const response = await Api.get(`usuario/vistas/${idRol}/rol`)
        const vistasSeleccionadas = response.data.map(vista => {
            return vista.Nombre
        })
        vistas.value = vistasSeleccionadas

        Utils.loadingNotify(false, '')
    } catch (error) {
        console.log(error)
    }
}
const traerMenus = async () => {

    Utils.loadingNotify(true, 'Cargando vistas..')
    try {
        const response = await Api.get(`usuario/menus`)
        menus.value = response.data
        cargado.value = true
        Utils.loadingNotify(false, '')
    } catch (error) {
        console.log(error)
    }
}
const formatearMenus = (dato) => {
    return dato.map(menu => {
        return {
            label: menu.Nombre,
            children: menu.Vistas.map(vista => {
                return {
                    label: vista.Nombre
                }
            })
        }
    })
}
const actualizarVistas = async () => {

    if (rol.value === undefined) {
        Utils.notificacion("Selecciona un rol antés")
        return
    }
    if (!(await Utils.confirmarAccion("Seguro de realizar cambios ?"))) {
        return
    }

    const rolEnviar = {
        IdRol: rol.value,
        Vistas: vistas.value
    };

    const response = await Api.post("usuario/actualizarvistas", rolEnviar)
    Utils.respuesta(response.data)

}
const actualizarRol = (usuario) => {
    ventanaActualizarRol.value = true
    UsuarioA.value = usuario
}
const guardarActualizarUsuario = async () => {


    try {
        if (!(await Utils.confirmarAccion("Seguro de realizar cambios ?"))) {
            return
        }
        Utils.loadingNotify(true, "Aplicando cambios")
        const response = await Api.post("usuario/actualizar", UsuarioA.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            traerUsuarios()
            ventanaActualizarRol.value = false
            UsuarioA.value = {}
        }
        Utils.loadingNotify(false)
    } catch (error) {

        console.log(error)
    }


}
const filtrarSupervisor = async (filtro, update) => {
    if (filtro.undefined || filtro === '') {
        return
    }
    try {
        const response = await Api.get(`usuario/supervisor/${filtro}`);
        update(() => {
            if (response.data !== '') {
                terceros.value = response.data
            } else {
                const needle = val.toLowerCase();
                terceros.value = stringOptions.filter(option =>
                    option.toLowerCase().includes(needle)
                );
            }
        });
    } catch (error) {
        console.log(error);
    }
}

//Setting grupo 
let IdUsuario
const abrirVentana = async () => {
    // UsuariosGrupo.value.rows = []
    traerInspectoresSinGrupo()
    traerGruposTrabajo()
    seleccionados.value = []
    grupoTrabajo.value = {}
    ventanaGestionGrupo.value = true
}
const guardarGrupoTrabajo = async () => {

    try {
        if (!(await Utils.confirmarAccion("Seguro de realizar registro ?"))) {
            return
        }
        Utils.loadingNotify(true, "Creando grupo")
        grupoTrabajo.value.Terceros = seleccionados.value
        gruposTrabajo.value.IdUsuario = IdUsuario
        const response = await Api.post("usuario/creargrupo", grupoTrabajo.value)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            traerUsuarios()
            traerGruposTrabajo()
            traerInspectoresSinGrupo()
            grupoTrabajo.value = {}
            seleccionados.value =[]
            ventanaActualizarRol.value = false
            UsuarioA.value = {}
        }
        Utils.loadingNotify(false)
    } catch (error) {

        console.log(error)
    }


}
const traerInspectoresSinGrupo = async () => {

    Utils.loadingNotify(true, "Cargando")
    try {
        const response = await Api.get("usuario/listarinspectoressingrupo")
        UsuariosGrupo.value.rows = response.data
        ventanaGestionGrupo.value = true
        Utils.loadingNotify(false)
    } catch (error) {

        console.log(error)
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
const traerGrupoXId = async (idGrupo) => {

    Utils.loadingNotify(true, "Cargando información")
    try {
        const response = await Api.get(`usuario/grupo/${idGrupo}`)
        grupoTrabajo.value = response.data
        Utils.loadingNotify(false, "")
    } catch (error) {
        console.log(error)
    }
}
const eliminarUsuarioGrupo = async (IdUsuario) => {
    if (!(await Utils.confirmarAccion("Seguro de eliminar el inspector del grupo esto puede ocasionar problemas"))) {
        return
    }
    Utils.loadingNotify(true, "Eliminando")
    try {
        const response = await Api.get(`usuario/eliminarusuariogrupo/${IdUsuario}`)
        Utils.respuesta(response.data)
        if (response.data.IsExito) {
            traerGrupoXId(grupoTrabajo.IdGrupoTrabajo)
            traerInspectoresSinGrupo()
        }
        traerGrupoXId(grupoTrabajo.value.IdGrupoTrabajo)
    } catch (error) {
        console.log(error)
    }
}



UsuariosGrupo.value.columns = [
    { align: "left", label: "Identificacion", field: "Identificacion", name: "Identificacion" },
    { align: "left", label: "Nombre Completo", field: "NombreCompleto", name: "NombreCompleto" },
    { align: "left", label: "Rol", field: "Rol", name: "Rol" },
    { align: "left", label: "Grupo Trabajo", field: "Grupo", name: "Grupo" },
]
onMounted(async () => {

    Utils.datoUsuario()
        .then(response => {
            if (response === null) {
                router.push("/inicio/login")
                return
            }
            IdUsuario = response.IdUsuario
        })
        .catch(error => {
            console.log(error)
        })
    traerRols()
    traerMenus()
    await traerUsuarios()
})

</script>


<style>
.galeriaResponsive {
    display: grid;
    height: calc(100% - 50px);
    padding: 10px;
    column-gap: 10px;
    row-gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
}




.galeria_button {
    display: grid;
    padding: 10px;
    column-gap: 10px;
    row-gap: 15px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
}

.galeriaResponsive>div {
    overflow: auto;
    height: 100%;
    border: 1px solid #dddd;
}

@media screen and (min-width: 600px) {
    .galeria {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
    }
}

@media screen and (max-width: 600px) {

    .galeriaResponsive {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(3, 1fr);
    }

    .galeriaResponsive>div {
        overflow: visible !important;
    }

    .galeriaResponsive :nth-child(2) {
        grid-row: auto !important;

    }

    .galeriaResponsive>div:nth-child(3),
    .galeriaResponsive>div:nth-child(2) {
        height: 250px;
        overflow: auto !important;
    }


    .galeria_button {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
}
</style>