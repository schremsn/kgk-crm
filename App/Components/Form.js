import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';

import UserInput from './UserInput';

import usernameImg from './images/username.png';
import passwordImg from './images/password.png';
import eyeImg from './images/eye_black.png';
import styles from './Styles/ComponentStyles';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
    };
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    if (this.state.press === false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <UserInput
          value={this.props.username}
          source={usernameImg}
          placeholder={I18n.t('username')}
          autoCapitalize="none"
          returnKeyType="done"
          autoCorrect={false}
          onChangeText={value => this.props.onChangeUsername(value)}
        />
        <UserInput
          value={this.props.password}
          source={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder={I18n.t('password')}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={value => this.props.onChangePassword(value)}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}
        >
          <Image source={eyeImg} style={styles.iconEye} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

Form.propTypes = {
  password: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  onChangeUsername: PropTypes.func.isRequired,
};
