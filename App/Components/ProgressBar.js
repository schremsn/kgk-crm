import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import I18n from 'react-native-i18n';
import { Colors, Metrics } from '../Themes';
import styles from '../Containers/Styles/ContainerStyles';

const ProgressBar = ({isRefreshing, onRefresh}) => (
  <ScrollView
    style={styles.mainContainer}
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
    <View style={styles.progressBar}>
      <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : '#EA0000'} />
    </View>
  </ScrollView>
);

ProgressBar.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default ProgressBar;
