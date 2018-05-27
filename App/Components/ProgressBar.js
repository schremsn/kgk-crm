import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import I18n from 'react-native-i18n';
import { Colors, Metrics } from '../Themes';
import RoundedButton from './RoundedButton';
import styles from '../Containers/Styles/ContainerStyles';

const ProgressBar = ({
  isRefreshing, onRefresh, isSubmitLoading, style,
}) => {
  if (isSubmitLoading) {
    return (
      <View style={[styles.progressBarLoading]}>
        <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.mainContainer]}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[Colors.fire]}
          tintColor={Colors.snow}
          title={`${I18n.t('loading')}...`}
          titleColor={Colors.snow}
          progressBackgroundColor={Colors.snow}
        />
          }
    >
      <View style={[styles.progressBar, style]}>
         <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : '#EA0000'} />
         <Text style={{ color: 'white', fontSize: 17, marginTop: 30}}>Loading...</Text>
      </View>
    </ScrollView>
  );
};

ProgressBar.propTypes = {
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  style: PropTypes.object,
  isSubmitLoading: PropTypes.bool,
};

export default ProgressBar;
