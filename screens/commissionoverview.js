import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

export default class CommissionOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    tabBarLabel: 'Home',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Commission</Text>
      </View>
    );
  }
}
