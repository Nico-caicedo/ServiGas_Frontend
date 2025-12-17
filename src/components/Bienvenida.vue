<template>
    <p>
      {{ SaludoBienvenida }}, bienvenido.
    </p>
</template>

<script>
export default {
  name: "WelcomeCliente",
  data() {
    return {
      SaludoBienvenida: "",
    };
  },
  mounted() {
    this.obtenerHoraActual();
    this.validarCategoriaTiempo();
  },
  methods: {
    obtenerHoraActual() {
      const now = new Date();
      const horas = now.getHours();
    },
    validarCategoriaTiempo() {
      const now = new Date();
      const horas = now.getHours();

      switch (true) {
        case horas >= 6 && horas < 12:
          this.SaludoBienvenida = "Buenos días";
          break;
        case horas >= 12 && horas < 18:
          this.SaludoBienvenida = "Buenas tardes";
          break;
        default:
          this.SaludoBienvenida = "Buenas noches";
          break;
      }
    },
  },
};
</script>
