<script>
import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:50605/api",
  // baseURL: 'https://web.neosage.co/WebApiServigas/api/',
  // baseURL: "https://web.neosage.co/WebApiServigas/api",
  headers: {
    "Content-Type": "application/json"
  },
})



export default Api

</script>
