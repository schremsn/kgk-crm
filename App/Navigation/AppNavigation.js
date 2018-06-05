import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';

import { Colors } from '../Themes';

import TabBarBottom from '../Components/TabBarBottom';

import AuthLoadingScreen from '../Containers/AuthLoadingScreen';
import CommissionStatusListScreen from '../Containers/Commission/CommissionStatusListScreen';
import LoginScreen from '../Containers/LoginScreen';
import CommissionListScreen from '../Containers/Commission/CommissionListScreen';
import MoreScreen from '../Containers/MoreScreen';
import MessagesListScreen from '../Containers/Message/MessagesListScreen';
import MessageDetailScreen from '../Containers/Message/MessageDetailScreen';
import LeadStagesScreen from '../Containers/Lead/LeadStagesScreen';

import {
  ProductsListModal,
  ProductsDetailModal,
  ContactsListModal,
  ContactsAddModal,
  ContactDetailModal,
  ContactsEditModal,
  LeadListModal,
  LeadEditModal,
  LeadAddModal,
  LeadDetailModal,
  CommissionStatusDetailModal
} from './ModalNavigation';

const HomeStack = StackNavigator({
  CommissionListScreen: { screen: CommissionListScreen },
}, {
  headerMode: 'none',
  initialRouteName: 'CommissionListScreen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: Colors.background,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
const PipelineStack = StackNavigator({
  LeadStagesScreen: { screen: LeadStagesScreen },
  LeadDetailScreen: { screen: LeadDetailModal },
  LeadListScreen: { screen: LeadListModal },
  LeadEditScreen: { screen: LeadEditModal },
  LeadAddScreen: { screen: LeadAddModal },
  LeadCommissionStatusDetailScreen: { screen: CommissionStatusDetailModal },
  ProductsListScreen: { screen: ProductsListModal },
  ContactListScreen: { screen: ContactsListModal },
  ContactsAddScreen: { screen: ContactsAddModal },

}, {
  headerMode: 'none',
  initialRouteName: 'LeadStagesScreen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: Colors.background,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
const MoreStack = StackNavigator({
  MoreScreen: { screen: MoreScreen },
  ProductsListScreen: { screen: ProductsListModal },
  ProductDetailScreen: { screen: ProductsDetailModal },
  CommissionStatusDetailScreen: { screen: CommissionStatusDetailModal },
  CommissionStatusListScreen: { screen: CommissionStatusListScreen },
  ContactsListScreen: { screen: ContactsListModal },
  ContactDetailScreen: { screen: ContactDetailModal },
  ContactsAddScreen: { screen: ContactsAddModal },
  ContactsEditScreen: { screen: ContactsEditModal },
  ContactsLeadAddScreen: { screen: LeadAddModal },

}, {
  headerMode: 'none',
  initialRouteName: 'MoreScreen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: Colors.background,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
const MessagesStack = StackNavigator({
  MessagesListScreen: { screen: MessagesListScreen },
  MessageDetailScreen: { screen: MessageDetailScreen },
}, {
  headerMode: 'none',
  initialRouteName: 'MessagesListScreen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: Colors.background,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

const AppStack = TabNavigator(
  {
    [I18n.t('home')]: { screen: HomeStack },
    [I18n.t('pipeline')]: { screen: PipelineStack },
    [I18n.t('message')]: { screen: MessagesStack },
    [I18n.t('more')]: { screen: MoreStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === I18n.t('home')) {
          iconName = `ios-home${focused ? '' : '-outline'}`;
        } else if (routeName === I18n.t('pipeline')) {
          iconName = `ios-podium${focused ? '' : '-outline'}`;
        } else if (routeName === I18n.t('message')) {
          iconName = `ios-mail${focused ? '' : '-outline'}`;
        } else if (routeName === I18n.t('more')) {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
      tabBarLabel: (() => {
        const { routeName } = navigation.state;
        return routeName;
      }),
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    lazy: false,
  },
);
const AuthStack = StackNavigator(
  { LoginScreen },
  {
    // Default config for all screens
    initialRouteName: 'LoginScreen',
    headerMode: 'none',
  },
);

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
