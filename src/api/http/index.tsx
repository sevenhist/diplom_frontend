import axios from 'axios'

export const API_URL = `https://therafit-backend.up.railway.app/api`

// export const API_URL = `http://localhost:3001/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config; 
    if(error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/auth/refreshAccessToken`, {withCredentials: true})
            localStorage.setItem('accessToken', response.data.data.token)
            return $api.request(originalRequest)
        } catch(e) {
            console.log("Not authorized")
        }
    }
    throw error;
})


export default $api