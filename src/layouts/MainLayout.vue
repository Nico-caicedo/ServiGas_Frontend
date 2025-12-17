<template>
  <q-layout view="hHh lpR fFf" class="T-primary">

    <!-- Header panel principal -->
    <q-header items-align="center"  class="q-pl-sm q-pr-sm row items-center justify-between"
      style="height: 55px; background-color: #2d7dc2">
      <q-btn class="boton-menu" dense flat round icon="menu" @click="visibilidadMenu = !visibilidadMenu" />
      <q-toolbar-title style="font-size: 18px;" class="row items-center">{{ DatosEmpresa.Nombre }} </q-toolbar-title>

      <q-btn size="sm" @click="cerrarSession" color="fondo-s" text-color="grey-8" icon="logout" />

    </q-header>

    <q-drawer show-if-above v-model="visibilidadMenu" :mini="ministate" class="F-primary" text-color-primary>

      <q-scroll-area class="bg-grey-3 text-grey-9" style="height: calc(100% - 70px)">
        <q-list padding>
          <!-- Iniciar mapeo para generar los items con sus elementos hijos dentro  -->
          <q-expansion-item v-for="menu in OpcionesMenu" :key="menu.IdMenu" :icon="menu.Icono" :label="menu.Nombre"
            expand-separator default-close @click="ministate = false">
            <template v-if="Array.isArray(menu.Vistas)">
              <q-item :to="vista.Url" clickable class="q-ml-md" v-for="(vista) in menu.Vistas" :key="vista.IdVista">
                <q-item-section avatar>
                  <q-icon :name="vista.Icono" />
                </q-item-section>
                <q-item-section>{{ vista.Nombre }}</q-item-section>
              </q-item>
            </template>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>

      <div class="q-pl-md absolute-bottom row items-center text-white justify-start"
        style="height: 70px; background-color: #2d7dc2">
        <q-icon size="sm" name="person" />
        <div v-if="!ministate" class="q-ml-md">
          <p style="font-size: 13px" class="q-ma-none">{{ usuario.NombreCompleto }}</p>
          <p style="font-size: 12px" class="q-ma-none">{{ usuario.Rol }}</p>
          <sub>Versión 1.0.0</sub>
        </div>
      </div>

      <div class="q-mini-drawer-hide absolute" style="top: 60px; right: -17px">
        <q-btn dense round unelevated color="blue-8" icon="chevron_left" @click="ministate = !ministate" />
      </div>
    </q-drawer>

    <q-page-container class="F-secundary absolute-bottom full-width full-height absolute-left">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, reactive, onErrorCaptured } from "vue";
import InfoGas from "src/utils/InfoGas.js";
import Utils from "src/utils/Utils";
import Api from "src/services/Api.vue";
import AuthService from "src/router/auth";
import { useRouter } from "vue-router";
const router = useRouter();


let usuario = reactive({})



let OpcionesMenu = ref({})

const visibilidadMenu = ref(false)
const ministate = ref(false)



const cerrarSession = async () => {
  if (!(await Utils.confirmarAccion("Seguro de cerrar sesión?"))) {
    return
  }
  try {
    AuthService.logout()
    router.push("/login")
  } catch (error) {
    console.log("Error al cerrar sesión")
  }

}
const DatosEmpresa = ref({})
InfoGas.TraerInfoGas()
  .then(response => {
    DatosEmpresa.value = response
  })

const traerMenu = async () => {
  if (usuario.IdUsuario === undefined) {
    router.push("/login")
  }
  await Utils.datoUsuario()
  const response = await Api.get(`usuario/menu/${usuario.IdUsuario}/usuario`)
  OpcionesMenu.value = response.data
}

onMounted(async () => {
  Utils.datoUsuario()
    .then(response => {
      if (response === null) {
        router.push("/login")
        return
      }
      usuario = response
      traerMenu()
    })
    .catch(error => {
      console.log(error)
    })

})


</script>
