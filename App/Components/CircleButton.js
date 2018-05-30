import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Containers/Styles/ContainerStyles';
import { Colors } from '../Themes';

export default class CircleButton extends Component {
  render() {
    return (
      <View style={styles.buttonBox}>
        <TouchableOpacity
          style={[this.props.styles]}
          onPress={this.props.onPress}
        >
          <View style={styles.button}>
            <Ionicons name={this.props.icon} size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>
      </View>

    );
  }
}

CircleButton.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.string,
  styles: PropTypes.object,
};
CircleButton.defaultProps = {
  styles: {},
  icon: 'ios-add-outline',
  onPress: () => { console.log('on press button'); },
};
