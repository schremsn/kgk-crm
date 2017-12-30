import React from 'react';
import {
  View, Text, FlatList, Button, TextInput
} from 'react-native';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

let that = null;

export default class CustomerNote extends React.Component {
  constructor(props) {
    super(props);

    that = this;
  }

  /**
   * save new note for customer
   */
  saveNote() {
    that.dataprovider = DataProvider.getInstance;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Note</Text>
        <FlatList>
          <TextInput
            numberOfLines={5}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
        </FlatList>
        <Button
          onPress={this.saveNote}
          tile="Save"
        />
      </View>
    );
  }
}
