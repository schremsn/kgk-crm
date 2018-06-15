import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import styles from './Styles/FullButtonStyles';

export default class FullButton extends Component {
  render() {
    return (
      <TouchableOpacity
        disable={this.props.disable}
        style={[styles.button, this.props.styles]}
        onPress={this.props.onPress}
      >
        <Text style={styles.buttonText}>{this.props.text && this.props.text.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }
}

FullButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  styles: PropTypes.object,
  disable: PropTypes.bool,
};
FullButton.defaultProps = {
  disable: false,
  styles: {},
};
