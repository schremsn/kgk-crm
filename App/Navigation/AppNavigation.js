import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';

import { Colors } from '../Themes';

import AuthLoadingScreen from '../Containers/AuthLoadingScreen';
import CommissionDetailScreen from '../Containers/CommissionDetailScreen';
import CommissionCompanyScreen from '../Containers/CommissionCompanyListScreen';
import CommissionListScreen from '../Containers/CommissionListScreen';
import LoginScreen from '../Containers/LoginScreen';
import LaunchScreen from '../Containers/LaunchScreen';
import ProductsListScreen from '../Containers/ProductsListScreen';
import ProductDetailScreen from '../Containers/ProductDetailScreen';
import WebViewScreen from '../Containers/WebViewScreen';
import MoreScreen from '../Containers/MoreScreen';
import MessagesListScreen from '../Containers/MessagesListScreen';
import MessageDetailScreen from '../Containers/MessageDetailScreen';

const HomeStack = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
}, {
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
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
const CommissionStack = StackNavigator({
  CommissionCompanyScreen: { screen: CommissionCompanyScreen },
  CommissionDetailScreen: { screen: CommissionDetailScreen },
  CommissionListScreen: { screen: CommissionListScreen },
}, {
  headerMode: 'none',
  initialRouteName: 'CommissionCompanyScreen',
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
const ProductStack = StackNavigator({
  ProductsListScreen: { screen: ProductsListScreen },
  ProductDetailScreen: { screen: ProductDetailScreen },
  WebViewScreen: { screen: WebViewScreen },
}, {
  initialRouteName: 'ProductsListScreen',
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
  WebViewScreen: { screen: WebViewScreen },
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
    Home: { screen: HomeStack },
    Status: { screen: CommissionStack },
    Message: { screen: MessagesStack },
    More: { screen: MoreStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-home${focused ? '' : '-outline'}`;
        } else if (routeName === 'Status') {
          iconName = `ios-list-box${focused ? '' : '-outline'}`;
        } else if (routeName === 'Products') {
          iconName = `ios-list-box${focused ? '' : '-outline'}`;
        } else if (routeName === 'Message') {
          iconName = `ios-mail${focused ? '' : '-outline'}`;
        } else if (routeName === 'More') {
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
