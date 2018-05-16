import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import Wallpaper from '../Components/Wallpaper';
import ButtonSubmit from '../Components/ButtonSubmit';
import { login } from '../Redux/AuthRedux';
import styles from '../Components/Styles/ComponentStyles';
import UserInput from '../Components/UserInput';
import { Images, Colors } from '../Themes';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'josef@kgk.vn',
      password: 'zaq12wsx',
      showPass: true,
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.showPass = this.showPass.bind(this);
  }
  onSignIn() {
    const { username, password } = this.state;
    this.props.login({ username, password }, info => this.signInAsync(info));
  }
  signInAsync = async (info) => {
    console.log(info);
    // await AsyncStorage.setItem('userToken', id)
    this.props.navigation.navigate('App');
  };
  showPass() {
    if (this.state.press === false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  }
  get renderForm() {
    return (
      <KeyboardAvoidingView behavior="padding" style={[styles.container, { marginTop: 20 }]}>
        <UserInput
          value={this.state.username}
          source={Images.username}
          placeholder={I18n.t('username')}
          autoCapitalize="none"
          returnKeyType="done"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={value => this.setState({ username: value })}
        />
        <UserInput
          value={this.state.password}
          source={Images.password}
          secureTextEntry={this.state.showPass}
          placeholder={I18n.t('password')}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
          onEndEditing={this.onSignIn}
          onChangeText={value => this.setState({ password: value })}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}
        >
          <Image source={Images.eye} style={styles.iconEye} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
  get renderLogo() {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Image source={Images.logo} style={styles.image} resizeMode="center" />
      </View>
    );
  }
  render() {
    return (
      <Wallpaper>
        {
          this.renderLogo
        }
        {
          this.renderForm
        }
        <ButtonSubmit onSignIn={this.onSignIn} navigation={this.props.navigation} />
      </Wallpaper>
    );
  }
}

LoginScreen.navigationOptions = {
  title: I18n.t('login'),
};
LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  login: (info, cb) => dispatch(login(info, cb)),
});

export default connect(null, mapDispatchToProps)(LoginScreen);
