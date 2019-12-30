export class ParseFilterSortParam {

  static getFilterConfig(queryParam) {

    const obj = {}

    const filterOptions = queryParam.slice(1).split('&')

    console.log(filterOptions)

    filterOptions.forEach(option => {

      const keyValArr = option.split('=')

      switch (keyValArr[0]) {
        case 'age':
          obj.age = keyValArr[1] - 0
          break
        case 'distance':
          obj.distance = keyValArr[1] - 0
          break
        case 'rating':
          obj.rating = keyValArr[1] - 0
          break
        case 'sexPref':
          obj.sexPref = keyValArr[1] - 0
          break
        case 'tags':
          obj.tags = keyValArr[1].split('+')
          break
        default:
          break
      }
    })

    console.log(obj)

    return obj
  }
}

export default ParseFilterSortParam
