<template>
  <div style="height: 100%;" class="bg-grey-2  absolute-bottom">
    <section class="column items-center justify-center q-pl-md q-pt-md q-pa-md"
      style="height: 60%; border-bottom-right-radius: 15%; border-bottom-left-radius: 15%;  background-color: #2d7dc2;">
      <span class="col column justify-center ">
        <h5 class="text-white q-mb-sm q-ma-none">{{ saludo }}</h5>
        <h6 class="text-white q-ma-none">Bienvenido <span class="row items-center"><h3 class="q-ma-none row">Servi<div class="contenedor"><h3 class="q-ma-none text-orange  ">Gas.<span>&#160;</span></h3></div></h3></span>
        </h6>
      </span>
      <q-form class="col q-mt-md">
        <q-input lazy-rules style="width: 400px; max-width: 90vw" bg-color="white" :rules="[Utils.regla]" outlined
          type="number" v-model="Usuario.Identificacion" label="Identificación" />
        <q-input lazy-rules style="width: 400px; max-width: 90vw" bg-color="white" :rules="[Utils.regla]" label="Clave"
          v-model="Usuario.Clave" outlined :type="estados.isPwd ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon :name="estados.isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="estados.isPwd = !estados.isPwd" />
          </template>
        </q-input>
      </q-form>
    </section>
    <div style="height: 40%" class="bg-grey-2 row items-center justify-center">
      <q-btn @click="ProcesarLogin" :loading="estados.loading" type="submit"
        style="border-radius: .5em ; width: 400px; max-width: 90vw" text-color="white" class="bg-orange" size="md">
        Iniciar Sesión
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Cargando...
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script setup>


import InfoGas from "src/utils/InfoGas.js";
import Utils from "src/utils/Utils.js";
import authService from "src/router/auth.js"
import Api from "src/services/Api.vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router"


let Usuario = reactive({Identificacion: '', Clave: ''});
let estados = reactive({})
const router = useRouter();
const saludo = ref({})


const validarCategoriaTiempo = () => {
  const now = new Date();
  const horas = now.getHours();

  switch (true) {
    case horas >= 6 && horas < 12:
      saludo.value = "Buenos días"
      break
    case horas >= 12 && horas < 18:
      saludo.value = "Buenas tardes"
      break
    default:
      saludo.value = "Buenas noches"
      break
  }

}
const ProcesarLogin = async () => {
  console.log(Usuario.Identificacion)
  if (Usuario.Identificacion == '' || Usuario.Clave == '') {
    Utils.notificacion('Complete todos los campos', false)
    return
  }
  estados.BotonEnviar = true
  Utils.loadingNotify(true, "Verificando usuario")
  try {
    const response = await Api.post("Usuario/validar", Usuario)
    Utils.notificacion(response.data.Mensaje, response.data.IsExito)
    if (response.data.IsExito) {
      authService.signIn(response.data)
      Utils.loadingNotify(false, "")
      router.push("inicio/index")
      return
    }
    estados.BotonEnviar = false
    Utils.loadingNotify(false, "")
  } catch (error) {
    Utils.loadingNotify(false, "")
    console.log(error)
  }
}

estados.isPwd = false
estados.BotonEnviar = false

onMounted(() => {
  validarCategoriaTiempo()
  Utils.datoUsuario()
    .then(response => {
      if (response !== null) {
        router.push("/inicio/index")
      }
      return
    })
    .catch(error => {
      console.log(error)
    })
})
</script>

<style>
.card-formulario {
  width: 400px;
  margin: 10px;
  background-color: rgba(0, 0, 0, 30%);
}

.contenedor-layout {
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}

.padding-form {
  padding: 15px;
}

.letra-responsive {
  font-size: 20px;
}

@media screen and (max-width: 600px) {
  .card-formulario {
    width: 90%;
    margin: 10px;
    background-color: rgba(0, 0, 0, 30%);
  }

}
.contenedor {
    margin: auto;
    display: flex;
}
.contenedor h3 {
    position: relative;
    float: left;
    background: #2d7dc2;
}
.contenedor h3 span {
    position:absolute;
    right:0;
    width:0;
    background: #2d7dc2;
    animation: escribir 3.5s steps(25) infinite alternate;
}
@keyframes escribir {
    from { width: 100% }
    to { width:0 }
}
</style>