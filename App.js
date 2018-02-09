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
import LeadCreate from './screens/leadcreate';
import Stages from './screens/stages';
import ProductList from './screens/productlist';
import i18n from './screens/translation/i18n';


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
      title: i18n.t('customer_detail'),
    },
  },
  Note: {
    screen: CustomerNote,
    navigationOptions: {
      title: i18n.t('note'),
    },
  },
});

const ProductStack = StackNavigator({
  ProductList: {
    screen: ProductList,
    navigationOptions: {
      header: null,
    },
  },
});

const LeadStack = StackNavigator({
  Stages: {
    screen: Stages,
    navigationOptions: {
      title: i18n.t('pipeline'),
    },
  },
  LeadList: {
    screen: Leadlist,
    navigationOptions: {
      title: i18n.t('leads'),
    },
  },
  LeadDetail: {
    screen: LeadDetail,
    navigationOptions: {
      title: i18n.t('lead_detail'),
    },
  },
  Convert: {
    screen: ConvertLead,
    navigationOptions: {
      title: i18n.t('convert_lead'),
    },
  },
  SelectCustomer: {
    screen: SelectCustomer,
    navigationOptions: {
      title: i18n.t('select_customer'),
    },
  },
  LogActivity: {
    screen: LogActivity,
    navigationOptions: {
      title: i18n.t('log_activity'),
    },
  },
  LeadCreate: {
    screen: LeadCreate,
    navigationOptions: {
      title: i18n.t('new_lead'),
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
    /*
    CustomerStack: {
      screen: CustomerStack,
    },
    */
    Product: {
      screen: ProductStack,
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
