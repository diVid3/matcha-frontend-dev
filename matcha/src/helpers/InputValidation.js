import uuidv4Checker from 'uuidv4'

export class InputValidation {
  static isValidName = (name) => /^\w{1,45}$/.test(name)
  static isValidLastName = (lastName) => /^[\w\s]{1,45}$/.test(lastName)
  static isValidAge = (age) => /^\d{1,2}$/.test(age) && (age - 0) >= 18 && (age - 0) <= 99
  static isValidAgeChars = (age) => /^\d{1,2}$/.test(age)
  static isValidAgeRange = (age) => (age - 0) >= 18 && (age - 0) <= 99
  static isValidEmail = (email) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)
  static isValidPassword = (password) => /^(?:\w|[a-z0-9!#$@%&'*+/=?^_`{|}~-]){6,200}$/.test(password)
  static isValidUuid = (uuid) => uuidv4Checker.is(uuid)
  static isValidBio = (bio) => /^[^\t]{1,250}$/.test(bio)
  static isValidMessage = (message) => /^.{0,10000}$/.test(message)

  static passwordHasUpperCase = (password) => /[A-Z]/.test(password)
  static passwordHasLowerCase = (password) => /[a-z]/.test(password)
  static passwordHasNumbers = (password) => /[0-9]/.test(password)
  static passwordHasOddChars = (password) => /[!@#$%^&*(){}[:;'"|,.<>+_~`=?\-/\\\]]/.test(password)
}

export default InputValidation
