import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import Toast from 'react-native-easy-toast';

import { Images, Metrics } from '../Themes';
import Header from './Header';
import GetDataFailed from './GetDataFailed';
import ProgressBar from './ProgressBar';
import CircleButton from './CircleButton';

import styles from '../Containers/Styles/ContainerStyles';

export default class BaseScreen extends Component {
  render() {
    const {
      children,
      fullLoading = false,
      isError = false,
      title,
      onPress,
      onRefresh,
      circleButton,
      circleIcon= 'ios-add-outline'
    } = this.props;
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        {
          title && <Header
            title={title}
            onPress={onPress}
          />
        }
        {(!fullLoading && !isError) && children}
        {
          circleButton && <CircleButton onPress={circleButton} icon={circleIcon} />
        }
        {fullLoading && <ProgressBar style={{ height: Metrics.screenHeight - 240 }} />}
        {
          isError && <GetDataFailed onRefresh={onRefresh} />
        }
        {/* <Toast ref={(c) => { this.toast = c; }} /> */}
      </View>
    );
  }
}
BaseScreen.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  fullLoading: PropTypes.bool,
};
