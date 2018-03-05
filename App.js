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
import CommissionOverview from './screens/commissionoverview';
import ProductDetail from './screens/productdetail';
import WebViewer from './screens/webview';
import i18n from './screens/translation/i18n';


const ProductStack = StackNavigator({
  ProductList: {
    screen: ProductList,
    navigationOptions: {
      header: null,
    },
  },
  ProductDetail: {
    screen: ProductDetail,
    navigationOptions: {
      title: i18n.t('product_detail'),
    },
  },
  Web: {
    screen: WebViewer,
    navigationOptions: {
      title: i18n.t('product_detail'),
    },
  },
});

const HomeStack = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
  CommissionOverview: {
    screen: CommissionOverview,
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

const MoreStack = StackNavigator({
  Account: {
    screen: Account,
    navigationOptions: {
      header: null,
    },
  },
});

const TabApp = TabNavigator(
  {
    Home: {
      screen: HomeStack,
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
    More: {
      screen: MoreStack,
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
