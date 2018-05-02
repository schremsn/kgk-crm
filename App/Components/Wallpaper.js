import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import styles from './Styles/ComponentStyles';

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

