import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';

import { Colors } from '../Themes';

import AuthLoadingScreen from '../Containers/AuthLoadingScreen';
import CommissionStatusDetailScreen from '../Containers/CommissionStatusDetailScreen';
import CommissionStatusListScreen from '../Containers/CommissionStatusListScreen';
import LoginScreen from '../Containers/LoginScreen';
import CommissionListScreen from '../Containers/CommissionListScreen';
import ProductsListScreen from '../Containers/ProductsListScreen';
import ProductDetailScreen from '../Containers/ProductDetailScreen';
import MoreScreen from '../Containers/MoreScreen';
import MessagesListScreen from '../Containers/MessagesListScreen';
import MessageDetailScreen from '../Containers/MessageDetailScreen';
import LeadStagesScreen from '../Containers/LeadStagesScreen';
import LeadDetailScreen from '../Containers/LeadDetailScreen';
import LeadListScreen from '../Containers/LeadListScreen';
import ContactsListScreen from '../Containers/ContactsListScreen';
import ContactsAddScreen from '../Containers/ContactsAddScreen';

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
  LeadDetailScreen: { screen: LeadDetailScreen },
  LeadListScreen: { screen: LeadListScreen },
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
  ProductsListScreen: { screen: ProductsListScreen },
  ProductDetailScreen: { screen: ProductDetailScreen },
  CommissionStatusDetailScreen: { screen: CommissionStatusDetailScreen },
  CommissionStatusListScreen: { screen: CommissionStatusListScreen },
  ContactsListScreen: { screen: ContactsListScreen },
  ContactsAddScreen: { screen: ContactsAddScreen },
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
    [I18n.t('home')] : { screen: HomeStack },
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
