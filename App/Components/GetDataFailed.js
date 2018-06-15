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

const GetDataFailed = ({ onRefresh, style }) => (
  <ScrollView
    style={[styles.mainContainer]}
  >
    <View style={[styles.progressBar, { height: Metrics.screenHeight - 240 }]}>
      <Text style={{ color: 'white', fontSize: 17, marginTop: 30 }}>{I18n.t('Connection error, data download failed')}</Text>
      <RoundedButton
        text="Retry"
        onPress={onRefresh}
      />
    </View>
  </ScrollView>
);

GetDataFailed.propTypes = {
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  style: PropTypes.object,
  isSubmitLoading: PropTypes.bool,
};

export default GetDataFailed;
