import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import styles from './Styles/ContainerStyles';


export default class AuthLoadingScreen extends React.Component {
  componentWillMount() {
    this.bootstrapAsync();
  }
  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('token1');
    console.log(userToken);
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
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
};
