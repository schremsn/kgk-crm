import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Image, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import CheckBox from 'react-native-check-box';
// libraries
import I18n from 'react-native-i18n';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import ButtonSubmit from '../Components/ButtonSubmit';
import styles from '../Components/Styles/ComponentStyles';
import UserInput from '../Components/UserInput';
// components
import Wallpaper from '../Components/Wallpaper';
import { login } from '../Redux/AuthRedux';
import { Colors, Images } from '../Themes';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'admin',
      password: 'zaq12wsx',
      showPass: true,
      isRemember: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.showPass = this.showPass.bind(this);
  }
  componentDidMount() {
    Keychain.resetGenericPassword();
  }
  onSignIn() {
    const { username, password, isRemember } = this.state;
    this.props.login({ username, password, isRemember }, (res, error) => {
      if (res) {
        this.props.navigation.navigate('App');
      } else {
        Alert.alert(
          'Login error',
          `${error}`,
          [
            { text: 'Retry' },
          ],
        );
      }
    });
  }
  showPass() {
    if (this.state.press === false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  }
  onClick() {
    this.setState({ isRemember: !this.state.isRemember });
  }
  get renderForm() {
    return (
      <KeyboardAvoidingView behavior="padding" style={[{ marginTop: 20 }]}>
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
        <CheckBox
          style={{ marginLeft: 35, marginBottom: 20 }}
          onClick={() => this.onClick()}
          isChecked={this.state.isRemember}
          rightText="Remember me"
          rightTextStyle={{ color: Colors.silver, fontSize: 16 }}
          checkBoxColor={Colors.silver}
        />
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
