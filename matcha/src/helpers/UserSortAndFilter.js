import ParseFilterSortParam from './ParseFilterSortParam'
import getDistance from 'geolib/es/getDistance';

export class UserSortAndFilter {

  // A user can have many tags, so the DB returns a join, this nests tags per user.
  static flattenUsersAndTags(data) {

    const flattenedData = []

    data.forEach((user) => {

      let insertedUserRef = undefined

      // if user has already been inserted + getting ref to it if true.
      if (flattenedData.some((insertedUser) => {
        if (insertedUser.username === user.username)
          insertedUserRef = insertedUser
        return insertedUser.username === user.username
      })) {

        insertedUserRef.tags.push(user.tag)
      }
      else {

        // creates a tags array and adds the first tag.
        user.tags = []
        user.tags.push(user.tag)
        delete user.tag
        flattenedData.push(user)
      }
    })

    return flattenedData
  }

  static filterData(queryParam, ownInfo, data) {

    const config = ParseFilterSortParam.getFilterConfig(queryParam)
    let filteredData = data

    if (config.age) {

      filteredData = filteredData.filter((user) => user.age <= config.age)
    }

    if (config.distance) {

      filteredData = filteredData.filter((user) => {
        const myCoords = { latitude: ownInfo.latitude, longitude: ownInfo.longitude }
        const userCoords = { latitude: user.latitude, longitude: user.longitude }
        const distanceBetweenUs = getDistance(myCoords, userCoords)

        // config.distance is in km, so dividing by a 1000 here.
        return (distanceBetweenUs / 1000) <= config.distance
      })
    }

    if (config.rating) {

      filteredData = filteredData.filter((user) => user.fame_rating >= config.rating)
    }

    if (config.sexPref || config.sexPref === 0) {

      filteredData = filteredData.filter((user) => user.sex_pref === config.sexPref)
    }

    if (config.tags) {

      filteredData = filteredData.filter((user) => config.tags.every((tag) => user.tags.includes(tag)))
    }

    return filteredData
  }

  static sortData(queryParam, ownInfo, data) {

    const config = ParseFilterSortParam.getSortConfig(queryParam)

    switch (config.sort) {

      case 'age':
        data.sort((prevUser, nextUser) => prevUser.age - nextUser.age)
        break
      case 'distance':
        data.sort((prevUser, nextUser) => {
          const myCoords = { latitude: ownInfo.latitude, longitude: ownInfo.longitude }
          const prevUserCoords = { latitude: prevUser.latitude, longitude: prevUser.longitude }
          const nextUserCoords = { latitude: nextUser.latitude, longitude: nextUser.longitude }
          const prevUserDistFromMe = getDistance(myCoords, prevUserCoords) / 1000
          const nextUserDistFromMe = getDistance(myCoords, nextUserCoords) / 1000
          return prevUserDistFromMe - nextUserDistFromMe
        })
        break
      case 'rating':
        data.sort((prevUser, nextUser) => nextUser.fame_rating - prevUser.fame_rating)
        break
      case 'tags':
        data.sort((prevUser, nextUser) => {
          const prevUserFirstLettersOfTagsArr = []
          const nextUserFirstLettersOfTagsArr = []

          prevUser.tags.forEach((tag) => {
            const firstLetterOfTag = tag.split('')[0]
            prevUserFirstLettersOfTagsArr.push(firstLetterOfTag)
          })

          nextUser.tags.forEach((tag) => {
            const firstLetterOfTag = tag.split('')[0]
            nextUserFirstLettersOfTagsArr.push(firstLetterOfTag)
          })

          if (prevUserFirstLettersOfTagsArr.sort().join('') < nextUserFirstLettersOfTagsArr.sort().join('')) {
            return -1 
          }

          if (prevUserFirstLettersOfTagsArr.sort().join('') > nextUserFirstLettersOfTagsArr.sort().join('')) {
            return 1
          }

          return 0
        })
        break
      default:
        break
    }
  }
}

export default UserSortAndFilter
