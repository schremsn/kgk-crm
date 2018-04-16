import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Images } from '../Themes';
import RoundedButton from '../../App/Components/RoundedButton';
import ButtonCircle from '../../App/Components/ButtonCircle';

// Styles
import styles from './Styles/ProductsListScreenStyle';
import I18n from 'react-native-i18n';
import ProductsListScreen from './ProductsListScreen';

export default class MoreScreen extends Component {
  static navigationOptions = {
    title: I18n.t('more'),
  };
  constructor() {
    super();
    this.state = {
      isShowMenu: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  toggleMenu() {
    this.setState({ isShowMenu: !this.state.isShowMenu });
  }
  render() {
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <View style={styles.sectionHeaderContainer}>
          <RoundedButton onPress={this.toggleMenu}>
            {I18n.t('logOut')}
          </RoundedButton>
        </View>
        {
          this.state.isShowMenu && <TouchableOpacity style={[styles.buttonBox, { bottom: 100 }]} onPress={() => this.props.navigation.navigate('ProductsListScreen')}>
            <Text style={styles.text}>
              {I18n.t('product list')}
            </Text>
            <View style={styles.button}>
              <Ionicons name="ios-podium-outline" size={25} color="white" />
            </View>
          </TouchableOpacity>
        }
        <TouchableOpacity style={styles.buttonBox} onPress={() => { this.toggleMenu(); }}>
          <Text style={styles.text}>
            {I18n.t('menu')}
          </Text>
          <View style={styles.button}>
            <Ionicons name="ios-clipboard-outline" size={25} color="white" />
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}
