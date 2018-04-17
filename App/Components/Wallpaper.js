import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

import bgSrc from './images/wallpaper.png';

export default class Wallpaper extends Component {
  render() {
    return (
      <View style={styles.box}>
        <Image style={styles.picture} source={bgSrc} />
        {this.props.children}
      </View>
    );
  }
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  picture: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: DEVICE_HEIGHT,

  },
  box: {
    flex: 1,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
  },
});
