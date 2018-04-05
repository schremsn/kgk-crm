import React, { Component } from 'react'
import {AsyncStorage, Alert} from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Logo from '../Components/Logo'
import Form from '../Components/Form'
import Wallpaper from '../Components/Wallpaper'
import ButtonSubmit from '../Components/ButtonSubmit'
import SignupSection from '../Components/SignupSection'
// Styles
import styles from './Styles/LoginScreenStyle'

import DataProvider from '../Lib/dataprovider'

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'josef@kgk.vn',
      password: 'zaq12wsx'
    }
  }
  static navigationOptions = {
    title: 'Login'
  };
  onSignIn = () => {
    const dataprovider = new DataProvider()
    dataprovider.login(this.state.username, this.state.password)
      .then((res) => {
        console.log(res)
        this.signInAsync(res.session_id)
        this.props.navigation.navigate('ProductsListScreen')
      })
      .catch((err) => {
        Alert.alert(
          `Login error ${err}`,
          'Username or password are incorrect.',
          [
            { text: 'Retry' }
          ]
        )
      })
  }
  signInAsync = async (id) => {
    // await AsyncStorage.setItem('userToken', id)
    this.props.navigation.navigate('App')
  };
  render () {
    return (
      <Wallpaper>
        <Logo />
        <Form username={this.state.username} password={this.state.password} />
        <ButtonSubmit onSignIn={() => this.onSignIn()} navigation={this.props.navigation} />
      </Wallpaper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
