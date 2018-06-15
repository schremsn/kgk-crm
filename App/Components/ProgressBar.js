import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import { Colors, Metrics } from '../Themes';
import styles from '../Containers/Styles/ContainerStyles';

const ProgressBar = ({ isSubmitLoading, style }) => {
  if (isSubmitLoading) {
    return (
      <View style={[styles.progressBarLoading]}>
        <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
        <Text style={{ color: 'white' }}>Save...</Text>
      </View>
    );
  }
  return (
    <View style={[styles.progressBar, style]}>
      <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : '#EA0000'} />
      <Text style={{ color: 'white' }}>Loading...</Text>
    </View>
  );
};

ProgressBar.propTypes = {
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  style: PropTypes.object,
  isSubmitLoading: PropTypes.bool,
};

export default ProgressBar;
