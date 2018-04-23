import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, Image, TouchableOpacity } from 'react-native';

import I18n from 'react-native-i18n';
import { Images } from '../Themes';
import styles from './Styles/Header';

export default class Header extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        style={styles.boxHeader}
      >
        <Image source={Images.backButton} />
        <Text style={styles.textTitle}>{I18n.t(this.props.title).toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
