import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, Image, TouchableOpacity, View } from 'react-native';

import I18n from 'react-native-i18n';
import { Images } from '../Themes';
import styles from './Styles/ComponentStyles';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.boxHeader}>
        <TouchableOpacity
          onPress={() => this.props.onPress()}
          style={styles.boxButton}
        >
          <Image source={Images.backButton} />
        </TouchableOpacity>
        <Text style={styles.textTitle}>{I18n.t(this.props.title).toUpperCase()}</Text>
      </View>
    );
  }
}
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
