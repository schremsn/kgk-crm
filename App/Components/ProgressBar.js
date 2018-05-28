import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import { Colors, Metrics } from '../Themes';
import styles from '../Containers/Styles/ContainerStyles';

const ProgressBar = ({ isSubmitLoading, style }) => {
  if (isSubmitLoading) {
    return (
      <View style={[styles.progressBarLoading]}>
        <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
      </View>
    );
  }
  return (
    <View style={[styles.progressBar, style]}>
      <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : '#EA0000'} />
      <LinearTextGradient
        style={styles.linearText}
        locations={[0, 1]}
        colors={['red', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        Loading...
      </LinearTextGradient>
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
