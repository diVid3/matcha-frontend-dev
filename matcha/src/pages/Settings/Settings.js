import React, { Component } from 'react'
import InputValidation from '../../helpers/InputValidation'
import PromiseCancel from '../../helpers/PromiseCancel'
import ParseUserInfo from '../../helpers/ParseUserInfo'
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
      usernameTaken: false,
      age: '',
      ageValid: true,
      biography: '',
      biographyValid: true,
      email: '',
      emailValid: true,
      emailTaken: false,
      password: '',
      passwordValid: true,
      passwordConfirm: '',
      passwordConfirmValid: true,
      passwordsMatch: true,
      gender: '0',
      sexPref: '0',
      userInfo: null,
      pictures: null,
      tags: null,
      savedForm: false,
      part1ErrorToShow: '',
      part2ErrorToShow: ''
    }

    this.pendingPromises = []

    this.usernameDebounceTimer = undefined
    this.emailDebounceTimer = undefined
    this.canSubmit = true

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeDecorator = this.handleChangeDecorator.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.showError = this.showError.bind(this)
    this.handleInitialSubmit = this.handleInitialSubmit.bind(this)
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

  handleUsernameChange(targetState, validationFunc) {

    return (e) => {
      const { name, value } = e.target

      this.setState({
        [name]: value,
        [targetState]: validationFunc(value)
      })

      clearTimeout(this.usernameDebounceTimer)

      this.usernameDebounceTimer = setTimeout(() => {

        if (this.state.usernameValid) {

          const cancelableUsernameTakenPromise = PromiseCancel.makeCancelable(
            UsersProvider.getUserByUsername({
              username: this.state.username
            })
          )
  
          this.pendingPromises.push(cancelableUsernameTakenPromise)
  
          cancelableUsernameTakenPromise.promise
          .then((json) => {
  
            if (json.rows.length) {
  
              this.setState({
                usernameTaken: true,
                usernameValid: false
              })
            }
            else {
  
              this.setState({
                usernameTaken: false,
                usernameValid: true
              })
            }
          })
          .catch((json) => {

            this.setState({
              part1ErrorToShow: 'Oops something went wrong... Please try again later...'
            })
            this.showError('part1ErrorToShow')
          })
        }
      }, 600)
    }
  }

  handleEmailChange(targetState, validationFunc) {

    return (e) => {
      const { name, value } = e.target

      this.setState({
        [name]: value,
        [targetState]: validationFunc(value)
      })

      clearTimeout(this.emailDebounceTimer)

      this.emailDebounceTimer = setTimeout(() => {

        if (this.state.emailValid) {

          const cancelableEmailTakenPromise = PromiseCancel.makeCancelable(
            UsersProvider.getUserByEmail({
              email: this.state.email
            })
          )
  
          this.pendingPromises.push(cancelableEmailTakenPromise)
  
          cancelableEmailTakenPromise.promise
          .then((json) => {
  
            if (json.rows.length) {
  
              this.setState({
                emailTaken: true,
                emailValid: false
              })
            }
            else {
  
              this.setState({
                emailTaken: false,
                emailValid: true
              })
            }
          })
          .catch((json) => {
  
            this.setState({
              part1ErrorToShow: 'Oops something went wrong... Please try again later...'
            })
            this.showError('part1ErrorToShow')
          })  
        }
      }, 600)
    }
  }

  showError(errorState) {

    const cancelableResetPromise = PromiseCancel.makeCancelable(
      new Promise(res => setTimeout(() => res(true), 5000))
    )

    this.pendingPromises.push(cancelableResetPromise)

    cancelableResetPromise.promise
    .then(() => {

      this.setState({
        [errorState]: ''
      })
    })
    .catch(() => {})
  }

  handleInitialSubmit() {

    let hadToSetState = false

    if (this.state.passwordValid && this.state.password === '') {
      
      this.setState({
        passwordValid: false
      })

      hadToSetState = true
    }

    if (this.state.passwordConfirmValid && this.state.passwordConfirm === '') {
      
      this.setState({
        passwordConfirmValid: false
      })

      hadToSetState = true
    }

    if (hadToSetState) {

      return true
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.handleInitialSubmit()) {

      return
    }

    if (
      this.canSubmit &&
      this.state.firstNameValid &&
      this.state.lastNameValid &&
      this.state.usernameValid &&
      this.state.ageValid &&
      this.state.biographyValid &&
      this.state.emailValid &&
      this.state.passwordValid &&
      this.state.passwordConfirmValid &&
      this.state.passwordsMatch
    ) {

      this.canSubmit = false
      setTimeout(() => { this.canSubmit = true }, 3000)

      const cancelablePatchUserByEmailPromise = PromiseCancel.makeCancelable(
        UsersProvider.patchUserByEmail({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          username: this.state.username,
          age: this.state.age + '',
          biography: this.state.biography,
          email: this.state.email,
          password: this.state.password,
          gender: this.state.gender + '',
          sexPref: this.state.sexPref + '',
        }, this.state.userInfo.email)
      )
  
      this.pendingPromises.push(cancelablePatchUserByEmailPromise)

      // TODO: Could perhaps add a loading animation to the button, like a clock spinner here.

      cancelablePatchUserByEmailPromise.promise
      .then((json) => {

        this.setState({
          savedForm: true
        })

        const cancelableResetSavedFormPromise = PromiseCancel.makeCancelable(
          new Promise((res, rej) => {
            setTimeout(() => {
              this.setState({
                savedForm: false
              })
              res()
            }, 3000)
          })
        )

        this.pendingPromises.push(cancelableResetSavedFormPromise)

        cancelableResetSavedFormPromise.promise
        .then(() => {})
        .catch(() => {})
      })
      .catch((json) => {

        sessionStorage.setItem('viewError', '1')

        this.setState({
          isBusy: false,
          redirectTo: '/oops'
        })
      })
    }
  }

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
                        <div className="settings-page-input-container">
                          <div className="settings-page-input-error-container">
                            <p className="settings-page-input-error-container-heading">Username</p>
                            <p
                              className={
                                `settings-page-input-error ${
                                  this.state.username !== this.state.userInfo.username && this.state.usernameTaken
                                    ? ''
                                    : 'settings-page-input-error-disable'
                                }`
                              }
                            >
                              Username Taken
                            </p>
                          </div>
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
                              this.handleUsernameChange(
                                'usernameValid',
                                InputValidation.isValidName
                              )
                            }
                            placeholder="Username"
                          />
                        </div>
                        <div className="settings-page-input-container">
                          <p className="settings-page-input-container-heading">First Name</p>
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
                        </div>
                        <div className="settings-page-input-container">
                          <p className="settings-page-input-container-heading">Last Name</p>
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
                        </div>
                        <div className="settings-page-input-container">
                          <p className="settings-page-input-container-heading">Age</p>
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
                        </div>
                        <div className="settings-page-input-container">
                          <p className="settings-page-input-container-heading">Biography</p>
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
                      </div>
                      <div className="settings-page-part-1-form-right">
                        <div className="settings-page-input-container">
                          <div className="settings-page-input-error-container">
                            <p className="settings-page-input-error-container-heading">Email</p>
                            <p
                              className={
                                `settings-page-input-error ${
                                  this.state.email !== this.state.userInfo.email && this.state.emailTaken
                                    ? ''
                                    : 'settings-page-input-error-disable'
                                }`
                              }
                            >
                              Email Taken
                            </p>
                          </div>
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
                              this.handleEmailChange(
                                'emailValid',
                                InputValidation.isValidEmail
                              )
                            }
                            placeholder="Email"
                          />
                        </div>
                        <div className="settings-page-input-container">
                          <p className="settings-page-input-container-heading">Password</p>
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
                        </div>
                        <div className="settings-page-input-container">
                          <p className="settings-page-input-container-heading">Confirm Password</p>
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
                        </div>
                        <div className="settings-page-form-radio-group settings-page-form-radio-group-sex">
                          <p className="settings-page-input-container-heading">Sex</p>
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
                          <p className="settings-page-input-container-heading">Sexual Preference</p>
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
                            <label htmlFor="settings-page-heterosexual">{ ParseUserInfo.getSexuality(0) }</label>
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
                            <label htmlFor="settings-page-homosexual">{ ParseUserInfo.getSexuality(1) }</label>
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
                            <label htmlFor="settings-page-bisexual">{ ParseUserInfo.getSexuality(2) }</label>
                          </div>
                        </div>
                        <div className="settings-page-form-button-container">
                          <button
                            className={
                              `settings-page-form-button ${
                                this.state.savedForm
                                  ? 'settings-page-form-button-saved'
                                  : ''
                              }`
                            }
                            type="submit"
                            value="Submit"
                          >
                            {
                              this.state.savedForm
                                ? 'Saved'
                                : 'Save'
                            }
                          </button>
                        </div>
                      </div>
                    </form>
                    {
                      this.state.part1ErrorToShow.length
                        ? <div className="settings-page-correct-errors-message-container">
                            <p className="settings-page-correct-errors-message">
                              {this.state.part1ErrorToShow}
                            </p>
                          </div>
                        : null
                    }
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
