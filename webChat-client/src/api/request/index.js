import axios from 'axios'
import { baseURL, TIMEOUT } from './config'
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IuWpieWEvyIsInBhc3N3b3JkIjoiNDJkYWJhNWI5ODYwZDE4YTI5ZWY3YzJmODE0NGIyOWMiLCJpYXQiOjE3MDg2Mjc3NTgsImV4cCI6MTcwODcxNDE1OH0.ggp_DRyE0Lg9GrmYUw8Rm6HsepJaYfUUGSOfK0iTIRsFEYCwkjk1A2VaUbUavDpE70bNPYOOcpE6-Aus1Ig1PsUqcdH-m89hMnKwOvxpuN4LIMGKE8osEYSQr7yhr99r6EA7h3j3NHbZnAEp9C_-qmj-u2gjWm9YELsZ7tjA-KS0vvtFYIAvqRkY10w3CUBffA9Ps4bWw-VlxahfEFJHWDHN1mIp_3l-u81HGB267iQ-9L2RDrTx-DidxGb1D3QFuubGRnIW7wGlR2ZVQJbahXsYwxq6vwfR4CXAnbuU2THuQwJSO8KYt6sQEKoEnIItxHZiwrFF_2dJKUzq1OOmWg'

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
        Authorization: `Bearer ${token}`
      }
    })
  }

  post(config) {
    return this.request({
      ...config,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export default new WRequest(baseURL)
