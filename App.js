import CustomerList from './screens/customerlist';
import CustomerDetail from './screens/customerdetail';
import Leadlist from './screens/leadlist';
import LeadDetail from './screens/leaddetail';
import Home from './screens/home';
import Account from './screens/account';

import React from 'react';
import { StyleSheet, NativeModules, RTCEventEmitter } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

// import { DataProvider } from './lib/dataprovider';
const DataProvider = require('./lib/dataprovider.js').default;

const CustomerStack = StackNavigator({
  Customer: {
    screen: CustomerList,
    navigationOptions: {
      header: null,

    },
  },
  CustomerDetail: {
    screen: CustomerDetail,
    navigationOptions: {
      title: 'Customer Detail'
    },
  },
});

const LeadStack = StackNavigator({
  Lead: {
    screen: Leadlist,
    navigationOptions: {
      header: null,

    },
  },
  LeadDetail: {
    screen: LeadDetail,
    navigationOptions: {
      title: 'Customer Detail'
    },
  },
});


const TabApp = TabNavigator(
  {
    Home: {
      screen: Home,
    },
    CustomerStack: {
      screen: CustomerStack,
    },
    LeadStack: {
      screen: LeadStack,
    },
    Account: {
      screen: Account,
    },
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: 'yellow',
      showIcon: true,
      tabBarIcon: { focused: true, tintColor: 'blue' },
      labelStyle: {
        fontSize: 10,
      },
      tabStyle: {
        height: 48,
      },
      style: {
        backgroundColor: 'blue',
      },
    },
  },
);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataprovider = new DataProvider();
    this.dataprovider
      .login('admin', 'zaq12wsx')
      .then((result) => {
        console.log(`login: ${result}`);
      })
      .catch((err) => {
        console.log(`login err:${err}`);
      });

    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: true,
    };
  }

  componentWillMount() {
    console.log('mounted');
  }

  getData() {
    this.login();
    this.getLeads();
  }

  login() {
    this.status = new Date().toString();
    this.dataprovider
      .login({ username: 'admin', password: 'zaq12wsx' })
      .then((data) => {
        console.log(`log in data: ${data}`);
      })
      .catch((err) => {
        console.log(`login error: ${err}`);
      });
  }

  getLeads() {
    this.dataprovider
      .getLeads()
      .then((data) => {
        console.log(`got leads: ${data}`);
        this.setState({ data });
      })
      .catch((err) => {
        console.log(`error leads: ${err}`);
      });
  }

  onRefresh() {
    console.log('button click');
    that.getCustomers();
    that.status = new Date().toString();
  }

  render() {
    return <TabApp />;
  }
}
