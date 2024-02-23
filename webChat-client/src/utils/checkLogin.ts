import { getToken } from '@/utils/saveToken'

/**
 * 检查用户是否已登录
 * @returns
 */
const checkLoin = () => {
  const token = getToken()

  if (!token) {
    return false
  }
  return true
}

export default checkLoin
