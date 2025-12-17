import { LocalStorage } from "quasar";
import Utils from "src/utils/Utils";


let timeoutID;

const AuthService = {

  isAuthenticated() {
    return LocalStorage.getItem("authVerification") !== null;
  },
  startTimeout() {
    timeoutID = setTimeout(async () => {
      this.logout();
      if (!(await Utils.confirmarAccion("Tu sesión ha caducado. ¿Deseas volver a iniciar sesión?"))) {
        router.push("/login");
        return;
      }
      router.push("/login");
    }, 1000); // 15 minutos en milisegundos (15 * 60 * 1000)
  },
  resetTimeout() {
    clearTimeout(timeoutID);
    this.startTimeout();
  },
  logout() {
    LocalStorage.remove("authVerification");
  },
  signIn(data) {
    try {
      LocalStorage.set("authVerification", JSON.stringify(data.Dato));
      // this.startTimeout();

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión");
    }
  },
};

export default AuthService;
