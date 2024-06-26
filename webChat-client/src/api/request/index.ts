import axios from 'axios'
import { baseURL, TIMEOUT } from './config'
import { getToken } from '@/utils/saveToken'

class WRequest {
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: TIMEOUT
    })
  }

  request(config: any) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err: any) => {
          console.log('request err:', err)
          reject(err)
        })
    })
  }

  get(config: any) {
    return this.request({
      ...config,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    })
  }

  post(config: any) {
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
