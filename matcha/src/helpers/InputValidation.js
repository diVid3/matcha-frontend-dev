import uuidv4Checker from 'uuidv4'

export class InputValidation {
  static isValidName = (name) => /^\w{1,45}$/.test(name)
  static isValidAge = (age) => /^\d{1,2}$/.test(age) && (age - 0) >= 18 && (age - 0) <= 99
  static isValidAgeChars = (age) => /^\d{1,2}$/.test(age)
  static isValidAgeRange = (age) => (age - 0) >= 18 && (age - 0) <= 99
  static isValidEmail = (email) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)
  static isValidPassword = (password) => /^(?:\w|[a-z0-9!#$%&'*+/=?^_`{|}~-]){6,200}$/.test(password)
  static isValidUuid = (uuid) => uuidv4Checker.is(uuid)
}

export default InputValidation
