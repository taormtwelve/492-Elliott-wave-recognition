import axios from "axios";
const app = axios.create({
    baseURL: 'http://localhost:5000/'
})

export default app