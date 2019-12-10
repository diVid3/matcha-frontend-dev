import React, { Component, Fragment } from 'react'
import InputValidation from '../../../helpers/InputValidation'

import PropTypes from 'prop-types';
import './PasswordMeter.css'

export class PasswordMeter extends Component {
  constructor(props) {
    super()

    this.passwordStrength = 0

    this.calcPasswordStrength = this.calcPasswordStrength.bind(this)
    this.calcSentenceToDisplay = this.calcSentenceToDisplay.bind(this)
    this.getPasswordContainerCss = this.getPasswordContainerCss.bind(this)
    this.getPasswordWordCss = this.getPasswordWordCss.bind(this)
  }

  calcPasswordStrength() {

    this.passwordStrength = 0

    if (InputValidation.passwordHasLowerCase(this.props.password)) {
      this.passwordStrength += 1
    }
    
    if (InputValidation.passwordHasUpperCase(this.props.password)) {
      this.passwordStrength += 1
    }

    if (InputValidation.passwordHasNumbers(this.props.password)) {
      this.passwordStrength += 1
    }

    if (InputValidation.passwordHasOddChars(this.props.password)) {
      this.passwordStrength += 1
    }
  }

  calcSentenceToDisplay() {

    let sentenceToDisplay = ''

    switch(this.passwordStrength) {
      case 1:
        sentenceToDisplay = 'Password is very weak'
        break
      case 2:
        sentenceToDisplay = 'Password is weak'
        break
      case 3:
        sentenceToDisplay = 'Password is average'
        break
      case 4:
        sentenceToDisplay = 'Password is strong'
        break
      default:
        sentenceToDisplay = 'Password is very weak'
    }

    return sentenceToDisplay
  }

  getPasswordWordCss() {

    let baseClass = 'password-meter-word '

    switch(this.passwordStrength) {
      case 1:
        baseClass += 'password-meter-word-very-weak'
        break
      case 2:
        baseClass += 'password-meter-word-weak'
        break
      case 3:
        baseClass += 'password-meter-word-average'
        break
      case 4:
        baseClass += 'password-meter-word-strong'
        break
      default:
        baseClass += ''
    }

    return baseClass
  }

  getPasswordContainerCss() {

    let baseClass = 'password-meter-container '

    switch(this.passwordStrength) {
      case 1:
        baseClass += 'password-meter-container-very-weak'
        break
      case 2:
        baseClass += 'password-meter-container-weak'
        break
      case 3:
        baseClass += 'password-meter-container-average'
        break
      case 4:
        baseClass += 'password-meter-container-strong'
        break
      default:
        baseClass += ''
    }

    return baseClass
  }

  render() {

    this.calcPasswordStrength()

    return (
      <Fragment>
        {
          this.passwordStrength
            ? this.props.displayOnlyWord
                ? <p
                    className={ this.getPasswordWordCss() }
                    style={
                      this.props.customStyle
                        ? this.props.customStyle
                        : {} 
                    }
                  >
                    { this.calcSentenceToDisplay() }
                  </p>
                : <div className={ this.getPasswordContainerCss() }>
                    <p>{ this.calcSentenceToDisplay() }</p>
                  </div>
            : null
        }
      </Fragment>
    )
  }
}

PasswordMeter.propTypes = {
  displayOnlyWord: PropTypes.bool,
  password: PropTypes.string,
  customStyle: PropTypes.object
};

export default PasswordMeter
