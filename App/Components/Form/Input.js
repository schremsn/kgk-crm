import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Images } from '../../Themes';
import styles from '../../Containers/Styles/ContainerStyles';
import CircleButton from '../CircleButton';

export default class Input extends Component {
  render() {
    const {
      value, label, press, multiline, baseInput, editable, selectInput,
    } = this.props;
    return (
      <View >
        <Text style={styles.labelForm}>{label}</Text>
        {
          multiline &&
            <TextInput
              style={styles.inputFormMulti}
              value={value}
              multiline
              numberOfLines={3}
              onChangeText={text => press(text)}
            />
        }
        {
          baseInput && <View>
            <TextInput
              style={styles.inputFormMulti}
              value={value}
              editable={editable}
              onChangeText={text => press(text)}
            />
          </View>
        }
        {
          selectInput && <View>
            <TextInput
              style={styles.inputFormDisable}
              value={value}
              editable={editable}
            />
            {
              press && <TouchableOpacity
                style={styles.iconInputFormCustom}
                onPress={() => press()}
              >
                <Ionicons name="ios-open-outline" size={25} color={Colors.panther} />
              </TouchableOpacity>
            }
          </View>
        }

      </View>
    );
  }
}
Input.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  press: PropTypes.func,
  multiline: PropTypes.bool,
  baseInput: PropTypes.bool,
  editable: PropTypes.bool,
  selectInput: PropTypes.bool,
};
Input.defaultProps = {
  multiline: false,
  baseInput: false,
  editable: true,
  selectInput: true,
  press: (e) => { console.log(e); },
};
