import React from 'react';
import { View } from 'react-native';

export default class FlatListItemSeparator extends React.Component {
  render() {
    return (
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor: '#607D8B',
        }}
      />
    );
  }
}
