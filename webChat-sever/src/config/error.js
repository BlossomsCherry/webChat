/* error常量配置 */
const NAME_OR_PASSWORD_IS_REQUIRED = new Error('name_or_password_is_required')
const NAME_IS_ALREADY_EXISTS = new Error('name_is_already_exists')
const NAME_IS_NOT_EXISTS = new Error('name_is_not_exists')
const PASSWORD_IS_ERROR = new Error('password_is_error')
const UN_AUTHORIZATION = new Error('un_authorization')

module.exports = {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_IS_ALREADY_EXISTS,
  NAME_IS_NOT_EXISTS,
  PASSWORD_IS_ERROR,
  UN_AUTHORIZATION
}
