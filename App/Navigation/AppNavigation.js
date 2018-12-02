import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import I18n from 'react-native-i18n';

import { Colors } from '../Themes';

// import TabBarBottom from '../Components/TabBarBottom';

import AuthLoadingScreen from '../Containers/AuthLoadingScreen';
import CommissionStatusListScreen from '../Containers/Commission/CommissionStatusListScreen';
import LoginScreen from '../Containers/LoginScreen';
import CommissionListScreen from '../Containers/Commission/CommissionListScreen';
import MoreScreen from '../Containers/MoreScreen';
import MessagesListScreen from '../Containers/Message/MessagesListScreen';
import MessageDetailScreen from '../Containers/Message/MessageDetailScreen';
import MessageReplayScreen from '../Containers/Message/MessageReplayScreen';
import LeadStagesScreen from '../Containers/Lead/LeadStagesScreen';
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
  CommissionStatusDetailModal,
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
  LeadDetailScreen: { screen: LeadDetailScreen },
  LeadListScreen: { screen: LeadListScreen },
  LeadEditScreen: { screen: LeadEditScreen },
  LeadAddScreen: { screen: LeadAddScreen },
  LeadCommissionStatusDetailScreen: { screen: CommissionStatusDetailScreen },
  ProductsListPipelineScreen: { screen: ProductsListScreen },
  ContactListPipelineScreen: { screen: ContactsListScreen },
  ContactsAddPipelineScreen: { screen: ContactsAddScreen },

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
  ContactDetailScreen: { screen: ContactDetailScreen },
  ContactsAddScreen: { screen: ContactsAddScreen },
  ContactsEditScreen: { screen: ContactsEditScreen },
  ContactsLeadAddScreen: { screen: LeadAddScreen },

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
  MessageReplayScreen: { screen: MessageReplayScreen },
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
    swipeEnabled: true,
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

export default StackNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'float',
    cardStyle: { shadowColor: 'transparent' },
    navigationOptions: {
      header: null,
      headerStyle: {
        backgroundColor: Colors.primary,
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
        elevation: 0,

      },
      headerTintColor: Colors.snow,
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center',
        flexGrow: 1,
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
  },
);
