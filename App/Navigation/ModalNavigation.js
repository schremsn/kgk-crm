import React from 'react';
import { TabNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';

import ProductsListScreen from '../Containers/Product/ProductsListScreen';
import ProductDetailScreen from '../Containers/Product/ProductDetailScreen';
import ContactsListScreen from '../Containers/Contact/ContactsListScreen';
import ContactsAddScreen from '../Containers/Contact/ContactsAddScreen';
import ContactDetailScreen from '../Containers/Contact/ContactDetailScreen';
import ContactsEditScreen from '../Containers/Contact/ContactsEditScreen';
import LeadListScreen from '../Containers/Lead/LeadListScreen';
import LeadEditScreen from '../Containers/Lead/LeadEditScreen';
import LeadAddScreen from '../Containers/Lead/LeadAddScreen';
import LeadDetailScreen from '../Containers/Lead/LeadDetailScreen';
import CommissionStatusDetailScreen from '../Containers/Commission/CommissionStatusDetailScreen';

export const ProductsListModal = StackNavigator({
  ProductsListScreen: { screen: ProductsListScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'ProductsListScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const ProductsDetailModal = StackNavigator({
  ProductDetailScreen: { screen: ProductDetailScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'ProductDetailScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const ContactsListModal = StackNavigator({
  ContactsListScreen: { screen: ContactsListScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'ContactsListScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const ContactsAddModal = StackNavigator({
  ContactsAddScreen: { screen: ContactsAddScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'ContactsAddScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const ContactDetailModal = StackNavigator({
  ContactDetailScreen: { screen: ContactDetailScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'ContactDetailScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const ContactsEditModal = StackNavigator({
  ContactsEditScreen: { screen: ContactsEditScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'ContactsEditScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const LeadListModal = StackNavigator({
  LeadListScreen: { screen: LeadListScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'LeadListScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const LeadEditModal = StackNavigator({
  LeadEditScreen: { screen: LeadEditScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'LeadEditScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const LeadAddModal = StackNavigator({
  LeadAddScreen: { screen: LeadAddScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'LeadAddScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const LeadDetailModal = StackNavigator({
  LeadDetailScreen: { screen: LeadDetailScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'LeadDetailScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});
export const CommissionStatusDetailModal = StackNavigator({
  CommissionStatusDetailScreen: { screen: CommissionStatusDetailScreen },
}, {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'CommissionStatusDetailScreen',
  navigationOptions: {
    // tabBarVisible: false,
    // swipeEnabled: false,
  },
});

