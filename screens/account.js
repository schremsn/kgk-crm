import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    tabBarLabel: 'More',
  };

  onSignIn() {
    console.log('sign in');
  }

  onSignOut() {
    console.log('sign  out');
  }

  onChangePassword() {
    console.log('change password');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.onSignIn} title="Sign in" />
        <Button onPress={this.onSignOut} title="Sign out" />
        <Button onPress={this.onChangePassword} title=" Change password" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
  container: {
    marginTop: 22,
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
  },
  item: {
    padding: 5,
    fontSize: 16,
    height: 36,
    width: '100%',
  },
});
