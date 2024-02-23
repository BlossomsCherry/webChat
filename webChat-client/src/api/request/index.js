import axios from 'axios'
import { baseURL, TIMEOUT } from './config'
import { getToken } from '@/utils/saveToken'

class WRequest {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
      timeout: TIMEOUT
    })
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          console.log('request err:', err)
          reject(err)
        })
    })
  }

  get(config) {
    return this.request({
      ...config,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    })
  }

  post(config) {
    return this.request({
      ...config,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    })
  }
}

export default new WRequest(baseURL)
