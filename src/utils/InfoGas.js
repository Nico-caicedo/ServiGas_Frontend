import Api from "src/services/Api.vue";
const InfoGas = {
    TraerInfoGas: async () => {
        try {
            const response = await Api.get("empresa");

            document.documentElement.style.setProperty('--color-p', response.data.ColorPrincipal)
            document.documentElement.style.setProperty('--color-s', response.data.ColorSecundario)
            document.documentElement.style.setProperty('--color-t', response.data.ColorTerciario)
            return response.data
        } catch (error) {
            alert(error)
        }

    }

}




export default InfoGas