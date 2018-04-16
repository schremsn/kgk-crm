import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBox: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    paddingRight: 20,
    color: 'white',
  },
});
export default class ButtonCircle extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.buttonBox, this.props.level === 1 ? { bottom: 100 } : { bottom: 30 }]} >
        <Text style={styles.text}>
          {this.props.title}
        </Text>
        <View style={styles.button}>
          <Ionicons name={this.props.icon} size={25} color="white" onPess={() => this.props.onFunction()} />
        </View>
      </TouchableOpacity>
    );
  }
}


ButtonCircle.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  onFunction: PropTypes.func.isRequired,
};
