import axios from 'axios'
import { Message} from 'element-ui'

const service = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
    timeout: 30000
})

service.interceptors.request.use(
    config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const status = response.data.meta.status
        if(status !==200) {
            return Message.error('获取数据失败')
        }
        console.log(response)
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

export default service

