import React, {Component} from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image
} from 'react-native'

import UserInput from './UserInput'

import usernameImg from './images/username.png'
import passwordImg from './images/password.png'
import eyeImg from './images/eye_black.png'
import I18n from 'react-native-i18n'

export default class Form extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPass: true,
      press: false
    }
    this.showPass = this.showPass.bind(this)
  }

  showPass () {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false})
  }

  render () {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <UserInput
          value={this.props.username}
          source={usernameImg}
          placeholder={I18n.t('username')}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
        />
        <UserInput
          value={this.props.password}
          source={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder={I18n.t('password')}
          returnKeyType={'done'}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}>
          <Image source={eyeImg} style={styles.iconEye} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  btnEye: {
    position: 'absolute',
    top: 80,
    right: 28
  },
  iconEye: {
    width: 25,
    height: 25,
    zIndex: 1,
    tintColor: 'rgba(0,0,0,0.2)'
  }
})
