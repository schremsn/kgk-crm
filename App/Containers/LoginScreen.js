import React, { Component } from 'react'
import { connect } from 'react-redux'
import Logo from '../Components/Logo'
import Form from '../Components/Form'
import Wallpaper from '../Components/Wallpaper'
import ButtonSubmit from '../Components/ButtonSubmit'
import {login} from '../Redux/AuthRedux'
import I18n from 'react-native-i18n'

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'josef@kgk.vn',
      password: 'zaq12wsx'
    }
  }
  static navigationOptions = {
    title: I18n.t('login')
  };
  onSignIn = () => {
    const { username, password } = this.state
    this.props.login({username, password}, (info) => this.signInAsync(info))
  }
  signInAsync = async (info) => {
    console.log(info)
    // await AsyncStorage.setItem('userToken', id)
    this.props.navigation.navigate('App')
  };
  render () {
    return (
      <Wallpaper>
        <Logo />
        <Form
          username={this.state.username}
          onChangeUsername={(username) => this.setState({username})}
          password={this.state.password}
          onChangePassword={(password) => this.setState({password})}
        />
        <ButtonSubmit onSignIn={this.onSignIn} navigation={this.props.navigation} />
      </Wallpaper>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (info, cb) => dispatch(login(info, cb))
  }
}

export default connect(null, mapDispatchToProps)(LoginScreen)
