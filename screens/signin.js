import React from 'react';
import { Alert, Text, View, Button, Modal, TextInput, ScrollView } from 'react-native';

import DataProvider from '../lib/dataprovider';

let that = null;

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      username: 'admin',
      password: 'zaq12wsx',
    };
    that = this;
  }

  /**
   * create a new dataprovider instance and login using userename password
   */
  onSignIn() {
    const dataprovider = new DataProvider();
    dataprovider.login(that.state.username, that.state.password)
      .then((data) => {
        // wipe password after login
        that.state.password = '';
        that.setState({ modalVisible: false });
        that.props.done();
      })
      .catch((err) => {
        Alert.alert(
          'Login error',
          'Username or password are incorrect.',
          [
            { text: 'Retry' },
          ],
        );

        that.setState({ username: '' });
        that.setState({ password: '' });
      });
  }

  onClose() {
    console.log('close modal');
  }

  render() {
    return (
      <View style={{ padding: 10, flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.onClose}
        >
          <ScrollView style={{ padding: 10 }}>
            <Text style={{ fontSize: 20 }}>Welcome to KGK CRM</Text>
            <TextInput
              style={{ height: 40 }}
              placeholder="User name"
              autofocus={true}
              value={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
            <TextInput
              style={{ height: 40 }}
              placeholder="Password"
              secureTextEntry
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
          </ScrollView>
          <View>
            <Button onPress={this.onSignIn} title="Sign in" />
          </View>
        </Modal>
      </View>
    );
  }
}
