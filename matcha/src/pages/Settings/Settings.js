import React, { Component } from 'react'
import InputValidation from '../../helpers/InputValidation'
import PromiseCancel from '../../helpers/PromiseCancel'
import UsersProvider from '../../providers/UsersProvider'
import TagsProvider from '../../providers/TagsProvider'
import PicturesProvider from '../../providers/PicturesProvider'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'

import './Settings.css'
import defaultPic from '../../assets/placeholder.png'

const someTags = [
  {
    id: 1,
    user_id: 5,
    tag: 'matcha'
  },
  {
    id: 2,
    user_id: 5,
    tag: 'cooking'
  },
  {
    id: 3,
    user_id: 5,
    tag: 'gaming'
  },
  {
    id: 4,
    user_id: 5,
    tag: 'fishing'
  },
  {
    id: 5,
    user_id: 5,
    tag: 'women'
  },
  {
    id: 6,
    user_id: 5,
    tag: 'cats'
  },
  {
    id: 7,
    user_id: 5,
    tag: 'partying'
  },
  {
    id: 8,
    user_id: 5,
    tag: 'eipsteinDidn\'tKillHimself'
  },
  {
    id: 9,
    user_id: 5,
    tag: 'stars'
  },
  {
    id: 10,
    user_id: 5,
    tag: 'science'
  },
  {
    id: 11,
    user_id: 5,
    tag: 'coffee'
  }
]

export class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isBusy: true,
      firstName: '',
      firstNameValid: true,
      lastName: '',
      lastNameValid: true,
      username: '',
      usernameValid: true,
      age: '',
      ageValid: true,
      biography: '',
      biographyValid: true,
      email: '',
      emailValid: true,
      password: '',
      passwordValid: true,
      passwordConfirm: '',
      passwordConfirmValid: true,
      passwordsMatch: true,
      gender: '0',
      sexPref: '0',
      userInfo: null,
      pictures: null,
      tags: null
    }

    this.pendingPromises = []

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeDecorator = this.handleChangeDecorator.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this)
  }

  handleChangeDecorator(targetState, validationFunc) {

    return (e) => {
      const { name, value } = e.target

      if (targetState && validationFunc) {
        this.setState({
          [name]: value,
          [targetState]: validationFunc(value)
        })
      }

      this.setState({
        [name]: value
      })
    }
  }

  handlePasswordChange(e) {
    const { name, value } = e.target

    this.setState({
      [name]: value,
      passwordValid: InputValidation.isValidPassword(value),
      passwordsMatch: this.state.passwordConfirm === value
    })
  }

  handlePasswordConfirmChange(e) {
    const { name, value } = e.target

    this.setState({
      [name]: value,
      passwordConfirmValid: InputValidation.isValidPassword(value),
      passwordsMatch: this.state.password === value
    })
  }

  handleSubmit(e) {
    e.preventDefault()


  }

  // TODO: Debounce and check if username + email is not taken.

  componentDidMount() {

    const cancelableUserInfoPromise = PromiseCancel.makeCancelable(UsersProvider.getUserBySession())
    const cancelablePicturesPromise = PromiseCancel.makeCancelable(PicturesProvider.getPicturesBySession())
    const cancelableTagsPromise = PromiseCancel.makeCancelable(TagsProvider.getTagsBySession())

    this.pendingPromises.push(cancelableUserInfoPromise)
    this.pendingPromises.push(cancelablePicturesPromise)
    this.pendingPromises.push(cancelableTagsPromise)

    const cancelableGetUserDataPromise = PromiseCancel.makeCancelable(
      Promise.all([
        cancelableUserInfoPromise.promise,
        cancelablePicturesPromise.promise,
        cancelableTagsPromise.promise
      ])
    )
  
    this.pendingPromises.push(cancelableGetUserDataPromise)

    cancelableGetUserDataPromise.promise
    .then((obj) => {

      console.log(obj)

      // TODO: Iterate over the tags and higlight them.
      // TODO: The pictures will simply link to a path hosted publicly on the backend.
      this.setState({
        isBusy: false,
        userInfo: obj[0].rows[0],
        pictures: obj[1].rows,
        tags: someTags,
        // tags: obj[2].rows,
        firstName: obj[0].rows[0].first_name,
        lastName: obj[0].rows[0].last_name,
        username: obj[0].rows[0].username,
        age: obj[0].rows[0].age,
        biography: obj[0].rows[0].biography,
        email: obj[0].rows[0].email,
        gender: obj[0].rows[0].gender + '',
        sexPref: obj[0].rows[0].sex_pref + ''
      })
    })
    .catch((json) => {

      sessionStorage.setItem('viewError', '1')

      this.setState({
        isBusy: false,
        redirectTo: '/oops'
      })
    })
  }

  componentWillUnmount() {

    this.pendingPromises.forEach(p => p.cancel())
  }

  render() {
    return (
      <div className="settings-page">
        {
          !this.state.isBusy
            ? <div>
                <div className="settings-page-part settings-page-part-1">
                  <div className="settings-page-part-1-container">
                    <form className="settings-page-part-1-form" onSubmit={this.handleSubmit}>
                      <div className="settings-page-part-1-form-left">
                        <input
                          className={
                            `settings-page-form-input ${
                              this.state.firstNameValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="firstName"
                          value={this.state.firstName}
                          type="text"
                          onChange={
                            this.handleChangeDecorator(
                              'firstNameValid',
                              InputValidation.isValidName
                            )
                          }
                          placeholder="First Name"
                        />
                        <input
                          className={
                            `settings-page-form-input ${
                              this.state.lastNameValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="lastName"
                          value={this.state.lastName}
                          type="text"
                          onChange={
                            this.handleChangeDecorator(
                              'lastNameValid',
                              InputValidation.isValidName
                            )
                          }
                          placeholder="Last Name"
                        />
                        <input
                          className={
                            `settings-page-form-input ${
                              this.state.usernameValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="username"
                          value={this.state.username}
                          type="text"
                          onChange={
                            this.handleChangeDecorator(
                              'usernameValid',
                              InputValidation.isValidName
                            )
                          }
                          placeholder="Username"
                        />
                        <input
                          className={
                            `settings-page-form-input ${
                              this.state.ageValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="age"
                          value={this.state.age}
                          type="text"
                          onChange={
                            this.handleChangeDecorator(
                              'ageValid',
                              InputValidation.isValidAge
                            )
                          }
                          placeholder="Age"
                        />
                        <textarea
                          className={
                            `settings-page-form-textarea ${
                              this.state.biographyValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="biography"
                          value={this.state.biography}
                          onChange={
                            this.handleChangeDecorator(
                              'biographyValid',
                              InputValidation.isValidBio
                            )
                          }
                          placeholder="Biography"
                        />
                      </div>
                      <div className="settings-page-part-1-form-right">
                        <input
                          className={
                            `settings-page-form-input ${
                              this.state.emailValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="email"
                          value={this.state.email}
                          type="text"
                          onChange={
                            this.handleChangeDecorator(
                              'emailValid',
                              InputValidation.isValidEmail
                            )
                          }
                          placeholder="Email"
                        />
                        <input
                          className={
                            `settings-page-form-input ${
                              this.state.passwordValid
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="password"
                          value={this.state.password}
                          type="password"
                          onChange={this.handlePasswordChange}
                          placeholder="Password"
                        />
                        <input
                          className={
                            `settings-page-form-input ${
                              (this.state.passwordConfirmValid &&
                              this.state.passwordsMatch)
                                ? ''
                                : 'input-bad'
                            }`
                          }
                          name="passwordConfirm"
                          value={this.state.passwordConfirm}
                          type="password"
                          onChange={this.handlePasswordConfirmChange}
                          placeholder="Confirm Password"
                        />
                        <div className="settings-page-form-radio-group settings-page-form-radio-group-sex">
                          <p className="settings-page-element-heading">Sex</p>
                          <div className="settings-page-form-radio-sub-group">
                            <input
                              className="settings-page-form-radio-button"
                              id="settings-page-male"
                              name="gender"
                              value="0"
                              type="radio"
                              onChange={this.handleChangeDecorator()}
                              checked={this.state.gender === '0'}
                            />
                            <label htmlFor="settings-page-male">Male</label>
                          </div>
                          <div className="settings-page-form-radio-sub-group">
                            <input
                              className="settings-page-form-radio-button"
                              id="settings-page-female"
                              name="gender"
                              value="1"
                              type="radio"
                              onChange={this.handleChangeDecorator()}
                              checked={this.state.gender === '1'}
                            />
                            <label htmlFor="settings-page-female">Female</label>
                          </div>
                          <div className="settings-page-form-radio-sub-group">
                            <input
                              className="settings-page-form-radio-button"
                              id="settings-page-other"
                              name="gender"
                              value="2"
                              type="radio"
                              onChange={this.handleChangeDecorator()}
                              checked={this.state.gender === '2'}
                            />
                            <label htmlFor="settings-page-other">Other</label>
                          </div>
                        </div>
                        <div className="settings-page-form-radio-group settings-page-form-radio-group-sex-pref">
                          <p className="settings-page-element-heading">Sexual Preference</p>
                          <div className="settings-page-form-radio-sub-group">
                            <input
                              className="settings-page-form-radio-button"
                              id="settings-page-heterosexual"
                              name="sexPref"
                              value="0"
                              type="radio"
                              onChange={this.handleChangeDecorator()}
                              checked={this.state.sexPref === '0'}
                            />
                            <label htmlFor="settings-page-heterosexual">Heterosexual</label>
                          </div>
                          <div className="settings-page-form-radio-sub-group">
                            <input
                              className="settings-page-form-radio-button"
                              id="settings-page-homosexual"
                              name="sexPref"
                              value="1"
                              type="radio"
                              onChange={this.handleChangeDecorator()}
                              checked={this.state.sexPref === '1'}
                            />
                            <label htmlFor="settings-page-homosexual">Homosexual</label>
                          </div>
                          <div className="settings-page-form-radio-sub-group">
                            <input
                              className="settings-page-form-radio-button"
                              id="settings-page-bisexual"
                              name="sexPref"
                              value="2"
                              type="radio"
                              onChange={this.handleChangeDecorator()}
                              checked={this.state.sexPref === '2'}
                            />
                            <label htmlFor="settings-page-bisexual">Bisexual</label>
                          </div>
                        </div>
                        <div className="settings-page-form-button-container">
                          <button
                            className="settings-page-form-button"
                            type="submit"
                            value="Submit"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="settings-page-part settings-page-part-2">
        
                </div>
              </div>
            : <div className="settings-page-loading-container">
                <LoadingBlocks/>
              </div>
        }
      </div>
    )
  }
}

export default Settings
