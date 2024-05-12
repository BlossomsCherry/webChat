// import Cookies from 'js-cookie'

const TOKEN_KEY = 'user_token'

export function getToken() {
  // return Cookies.get(TOKEN_KEY)
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: any) {
  // return Cookies.set(TOKEN_KEY, token)
  return sessionStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  // return Cookies.remove(TOKEN_KEY)
  return sessionStorage.removeItem(TOKEN_KEY)
}
