import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  ScrollView,
  RefreshControl,
  Animated
} from 'react-native';
import I18n from 'react-native-i18n';
import { Colors, Metrics } from '../Themes';
import styles from '../Containers/Styles/ContainerStyles';
import AnimatedLinearGradient, { presetColors } from '../Components/Animate';
import NativeLinearGradient from 'react-native-linear-gradient';
import { LinearTextGradient } from 'react-native-text-gradient';

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
      {/*<AnimatedLinearGradient customColors={presetColors.instagram} speed={4000}>*/}

      {/*</AnimatedLinearGradient>*/}

      <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : '#EA0000'} />
      <LinearTextGradient
        style={{ fontWeight: '400', fontSize: 25, marginTop: 25, marginBottom: 60 }}
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
