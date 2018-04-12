import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';

import { Images } from '../Themes';
import RoundedButton from '../../App/Components/RoundedButton';

// Styles
import styles from './Styles/ProductsListScreenStyle';
import I18n from 'react-native-i18n';

export default class MoreScreen extends Component {
  static navigationOptions = {
    title: I18n.t('more'),
  };
  render() {
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <View style={styles.sectionHeaderContainer}>
          <RoundedButton onPress={() => this.props.navigation.navigate('WebViewScreen')}>
            {I18n.t('logOut')}
          </RoundedButton>
        </View>
      </View>
    );
  }
}
