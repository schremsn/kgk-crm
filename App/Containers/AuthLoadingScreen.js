import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator, Alert,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import { connect } from 'react-redux';

// libraries
import * as Keychain from 'react-native-keychain';
// actions
import { checkLogin } from '../Redux/AuthRedux';
// styles
import styles from './Styles/ContainerStyles';


class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this.bootstrapAsync();
  }
  bootstrapAsync = async () => {
    try {
      // Retreive the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.props.checkLogin({
          username: credentials.username,
          password: credentials.password,
        }, (res, error) => {
          if (res) {
            this.props.navigation.navigate('App');
          } else {
            this.props.navigation.navigate('Auth');
          }
        });
      } else {
        console.log('No credentials stored');
        this.props.navigation.navigate('Auth');
      }
    } catch (error) {
      this.props.navigation.navigate('Auth');
      console.log('Keychain couldn\'t be accessed!', error);
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
AuthLoadingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  checkLogin: PropTypes.func.isRequired,

};
const mapDispatchToProps = dispatch => ({
  checkLogin: (info, cb) => dispatch(checkLogin(info, cb)),
});
export default connect(null, mapDispatchToProps)(AuthLoadingScreen);
