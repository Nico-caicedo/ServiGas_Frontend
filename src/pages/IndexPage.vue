<template>
  <q-page class="q-pa-md column">
    <!-- <bienvenida class="self-start" /> -->
    <div class="row items-center justify-center" style="width: 100%;">
      <q-img class="selt-center" style="width: 500px; max-width: 100%;" fit="contain" src="icons/Fondo.png" />
    </div>
  </q-page>
</template>

<script>
import Bienvenida from 'src/components/Bienvenida.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { Bienvenida },
  name: 'IndexPage'
})
</script>
