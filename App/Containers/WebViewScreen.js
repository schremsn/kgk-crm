import React, { Component } from 'react';
import { WebView, Image, View } from 'react-native';

import { Images } from './../Themes';

// Styles
import styles from './Styles/ContainerStyles';

export default class WebViewScreen extends Component {
  static navigationOptions = {
    title: 'Website',
  };
  render() {
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <WebView
          source={{ uri: 'https://www.bing.com/' }}
        />
      </View>
    );
  }
}
