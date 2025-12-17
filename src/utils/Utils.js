import { Dialog, Notify, Loading, BottomSheet, date } from 'quasar'


const Utils = {
  confirmarAccion: async (mensaje) => {
    return new Promise((resolve) => {
      Dialog.create({
        title: 'Confirmación',
        message: mensaje,
        cancel: true,
        persistent: true,
        ok: {
          push: true,
          label: 'Si',
          color: 'positive'
        },
        cancel: {
          push: true,
          label: 'No',
          color: 'negative'
        },
      }).onOk(() => {
        resolve(true)
      }).onCancel(() => {
        resolve(false)
      })
    })
  },
  obtenerRespuestaPrompt: async (titulo) => {
    return new Promise((resolve) => {
      Dialog.create({
        title: titulo,
        prompt: {
          model: '',
          type: 'text',
          required: true,
          okLabel: 'Aceptar',
          cancelLabel: 'Cancelar'
        }
      }).onOk(data => {
        resolve(data)
        return data
      })
        .onCancel(() => {
          resolve(true)
          return null
        }).onDismiss(() => {
          resolve(true)
          return null
        })
    })
  },
  regla: (val) => {
    if (!val || val.lenght === 0) {
      return 'Este campo es obligatorio. *';
    } else {
      return true;
    }
  },
  reglaBloqueada: (val, estado) => {
    if (!estado && (!val || val.length === 0)) {
      return 'Este campo es obligatorio.';
    } else {
      return true;
    }
  },
  respuesta: async (res) => {
    const tipo = await res.IsExito ? 'check_circle' : 'error'
    const color = await res.IsExito ? 'green' : 'red'
    const mensaje = `
    <div class="column justify-center items-center">
    <i style="color: ${color}" class="q-mr-md q-icon material-icons text-h1 on-left notranslate " aria-hidden="true" role="img">${tipo}</i>
    <p class="text-center text-grey-9">${res.Mensaje}</p>
    </div>
    `
    Dialog.create({
      message: mensaje,
      icon: null,
      html: true,
      ok: true
    })
  },
  verOpcionesCamara: async () => {
    return new Promise((resolve, reject) => {
      BottomSheet.create({
        message: 'Opciones Camara',
        grid: true,
        actions: [
          {
            label: 'Galeria',
            icon: 'photo_library',
            id: 'galeria'
          },
          {
            label: 'Camara',
            icon: 'photo_camera',
            id: 'camara'
          }
        ]
      }).onOk(action => {
        if (action.id === 'camara') {
          resolve(1)
        }
        if (action.id === 'galeria') {
          resolve(2)
        }
      }).onCancel(() => {
        resolve(null)
      })

    })
  },
  tomarFoto: async (tipo) => {
    return new Promise((resolve, reject) => {

      navigator.camera.getPicture(
        data => {
          resolve(`data:image/jpeg;base64,${data}`);
        },
        error => {
          reject(error);
        },
        {
          quality: 100,
          destinationType: 0,
          targetWidth: 1600,
          targetHeight: 1200,
          sourceType: tipo,
          encodingType: 0,
          saveToPhotoAlbum: false,
          correctOrientation: true
        }
      );

    });
  },
  notificacion: async (mensaje, tipof) => {

    let tipo = await tipof ? 'check_circle' : 'error'
    let color = await tipof ? 'green' : 'red'
    if (tipof === null) {
      tipo = 'task_alt'
      color = 'orange'
    }
    const mensajeF = `
    <div class="column justify-center items-center">
    <i style="color: ${color}" class="q-mr-md q-icon material-icons text-h1 on-left notranslate " aria-hidden="true" role="img">${tipo}</i>
    <p class="text-center text-grey-9">${mensaje}</p>
    </div>
    `
    Dialog.create({
      message: mensajeF,
      icon: null,
      html: true,
      ok: true
    })
  },
  tiempoActual: async () => {
    const fechaColombia = date.formatDate(Date.now(), 'DD-MM-YYYY HH:mm:ss');
    return fechaColombia;
  },
  tiempoDate: async () => {
    const fechaColombia = date.formatDate(Date.now(), 'YYYY-MM-DD');
    return fechaColombia;
  },
  fechaManana: async () => {
    let manana = new Date();
    manana.setDate(manana.getDate() + 1);
    let formatoFecha = manana.toISOString().slice(0, 10);
    return formatoFecha
  },
  darFormatofecha: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "DD/MM/YYYY")
  },
  darFormatofechaConHoras: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "DD/MM/YYYY HH:mm:ss")
  },
  datoUsuario: async () => {
    try {
      const authVerification = localStorage.getItem("authVerification");
      const cleanString = authVerification.replace('__q_strn|', '');
      const usuario = JSON.parse(cleanString);
      return usuario;
    } catch (error) {

      return null;
    }
  },
  loadingNotify: async (estado, mensaje) => {

    if (estado) {

      Loading.show({
        backgroundColor: 'black',
        message: mensaje,
        boxClass: 'bg-grey-2 text-grey-9',
        spinnerColor: 'primary'
      })
    } else {
      Loading.hide()
    }
  }
}


export default Utils
