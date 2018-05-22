import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Images, Colors } from '../Themes';
import styles from './Styles/ContainerStyles';

const listActions = [
  {
    name: I18n.t('logOut'),
    routeName: 'Auth',
  },
  {
    name: I18n.t('product list'),
    routeName: 'ProductsListScreen',
  },
  {
    name: I18n.t('Contacts'),
    routeName: 'ContactsListScreen',
  },
  {
    name: I18n.t('account'),
    routeName: 'ProductsListScreen',
  },


];

export default class MoreScreen extends Component {
  constructor() {
    super();
    this.state = {
      isShowMenu: false,
    };
    this.contentAction = this.contentAction.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  toggleMenu() {
    this.setState({ isShowMenu: !this.state.isShowMenu });
  }
  contentAction(name, routeName, index) {
    return (
      <TouchableOpacity key={index} style={[styles.buttonBox, { bottom: 100 + (70 * index) }]} onPress={() => { this.props.navigation.navigate(routeName); }}>
        <Text style={styles.text}>
          {name}
        </Text>
        <View style={styles.button}>
          <Ionicons name="ios-clipboard-outline" size={25} color={Colors.snow} />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        {
          listActions.map((item, index) => (
            this.contentAction(item.name, item.routeName, index)
          ))
        }
      </View>
    );
  }
}
MoreScreen.navigationOptions = {
  title: I18n.t('more'),
};
MoreScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
