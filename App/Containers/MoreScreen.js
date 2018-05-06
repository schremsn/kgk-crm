import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Images, Colors } from '../Themes';
import styles from './Styles/ContainerStyles';
import LeadStagesScreen from "./LeadStagesScreen";

export default class MoreScreen extends Component {
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
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <TouchableOpacity style={[styles.buttonBox, { bottom: 310 }]} onPress={() => this.props.navigation.navigate('ProductsListScreen')}>
          <Text style={styles.text}>
            {I18n.t('account')}
          </Text>
          <View style={styles.button}>
            <Ionicons name="ios-person-outline" size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonBox, { bottom: 240 }]} onPress={() => this.props.navigation.navigate('CommissionStatusListScreen')}>
          <Text style={styles.text}>
            {I18n.t('status')}
          </Text>
          <View style={styles.button}>
            <Ionicons name="ios-list-box-outline" size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonBox, { bottom: 170 }]} onPress={() => this.props.navigation.navigate('ProductsListScreen')}>
          <Text style={styles.text}>
            {I18n.t('product list')}
          </Text>
          <View style={styles.button}>
            <Ionicons name="ios-list-box-outline" size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBox} onPress={() => { this.toggleMenu(); }}>
          <Text style={styles.text}>
            {I18n.t('logOut')}
          </Text>
          <View style={styles.button}>
            <Ionicons name="ios-clipboard-outline" size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}
MoreScreen.navigationOptions = {
  title: I18n.t('more'),
}
