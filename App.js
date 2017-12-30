import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Root } from 'native-base';

import CustomerList from './screens/customerlist';
import CustomerDetail from './screens/customerdetail';
import Leadlist from './screens/leadlist';
import LeadDetail from './screens/leaddetail';
import Home from './screens/home';
import Account from './screens/account';
import CustomerNote from './screens/note';
import ConvertLead from './screens/convertlead';
import SelectCustomer from './screens/selectcustomer';
import LogActivity from './screens/logactivity';


const CustomerStack = StackNavigator({
  Customer: {
    screen: CustomerList,
    navigationOptions: {
      header: null,

    }
  },
  CustomerDetail: {
    screen: CustomerDetail,
    navigationOptions: {
      title: 'Customer Detail',
    },
  },
  Note: {
    screen: CustomerNote,
    navigationOptions: {
      title: 'Note',
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
      title: 'Lead Detail',
    },
  },
  Convert: {
    screen: ConvertLead,
    navigationOptions: {
      title: 'Convert lead',
    },
  },
  SelectCustomer: {
    screen: SelectCustomer,
    navigationOptions: {
      title: 'Select customer',
    },
  },
  LogActivty: {
    screen: LogActivity,
    navigationOptions: {
      title: 'Log activity',
    },
  },
});

const TabApp = TabNavigator(
  {
    Home: {
      screen: Home,
    },
    LeadStack: {
      screen: LeadStack,
    },
    CustomerStack: {
      screen: CustomerStack,
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
        fontSize: 10
      },
      tabStyle: {
        height: 48
      },
      style: {
        backgroundColor: 'blue'
      }
    }
  }
)

/*
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.dataprovider = new DataProvider()
    this.dataprovider
      .login('admin', 'zaq12wsx')
      .then((result) => {
        console.log(`login: ${result}`)
      })
      .catch((err) => {
        console.log(`login err:${err}`)
      })
  }



  render() {
    return (
      <Root>
        <TabApp />
      </Root>
    )
  }
}
*/

export default () =>
  <Root>
    <TabApp />
  </Root>;
