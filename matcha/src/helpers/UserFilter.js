import ParseFilterSortParam from './ParseFilterSortParam'

// 1) Age slider: 18 -> 99 ( adjust upperbound ) [ front-end filter ]
// 2) Distance slider: 0 -> 1000 km ( relative to my location ) ( adjust upperbound ) [ front-end filter (geolib) ]
// 3) Rating slider: inf -> 0 ( adjust lowerbound ) [ front-end filter ]
// 4) SexualityPicker:
//    ( 0: 'Straight', 1: 'Gay', 2: 'Bisexual' ) ( relative to my sexPref ) [ front-end filter, only used in 'browse' ]
// 5) TagPicker: ( pick 3 tags, resulting profile tag set will need to have those 3 tags as a subset ) [ front-end filter ]

export class UserFilter {

  // A user can have many tags, so the DB returns a join, this nests tags per user.
  static flattenUsersAndTags(data) {

    const flattenedData = []

    data.forEach((user) => {

      // deleting tag id as it's not needed.
      delete user.id

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

    return filteredData
  }
}

export default UserFilter
