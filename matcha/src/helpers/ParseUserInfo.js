export class ParseUserInfo {

  static getGender(gender) {

    if (typeof gender === 'string') {
      gender -= 0
    }

    let genderString = ''

    switch (gender) {
      case 0:
        genderString = 'Male'
        break
      case 1:
        genderString = 'Female'
        break
      case 2:
        genderString = 'Other'
        break
      default:
        genderString = 'Other'
    }

    return genderString
  }

  static getSexuality(sexuality) {

    if (typeof sexuality === 'string') {
      sexuality -= 0
    }

    let sexualityString = ''

    switch (sexuality) {
      case 0:
        sexualityString = 'Heterosexual'
        break
      case 1:
        sexualityString = 'Homosexual'
        break
      case 2:
        sexualityString = 'Bisexual'
        break
      default:
        sexualityString = 'Bisexual'
    }

    return sexualityString
  }
}

export default ParseUserInfo
