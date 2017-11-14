import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  NativeModules,
  RTCEventEmitter
} from "react-native";
import { TabNavigator } from "react-navigation";

//import { DataProvider } from './lib/dataprovider';
const DataProvider = require("./lib/dataprovider.js").default;

import CustomerList from "./screens/customerlist";
import LeadList from "./screens/leadlist";
import Home from "./screens/home";
import Account from "./screens/account";

const TabApp = TabNavigator(
  {
    Home: {
      screen: Home
    },
    CustomerList: {
      screen: CustomerList
    },
    LeadList: {
      screen: LeadList
    },
    Account: {
      screen: Account
    }
  },
  {
    lazy: true,
    tabBarPosition: "bottom",
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "yellow",
      showIcon: true,
      tabBarIcon: { focused: true, tintColor: "blue" },
      labelStyle: {
        fontSize: 10
      },
      tabStyle: {
        height: 50
      },
      style: {
        backgroundColor: "blue"
      }
    }
  }
);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataprovider = new DataProvider();
    this.dataprovider
      .login("admin", "zaq12wsx")
      .then(result => {
        console.log("login: " + result);
      })
      .catch(err => {
        console.log("login err:" + err);
      });

    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: true
    };
  }

  componentWillMount() {
    console.log("mounted");
  }

  getData() {
    this.login();
    this.getLeads();
  }

  login() {
    this.status = new Date().toString();
    this.dataprovider
      .login({ username: "admin", password: "zaq12wsx" })
      .then(data => {
        console.log("log in data: " + data);
      })
      .catch(err => {
        console.log("login error: " + err);
      });
  }

  getLeads() {
    this.dataprovider
      .getLeads()
      .then(data => {
        console.log("got leads: " + data);
        this.setState({ data: data });
      })
      .catch(err => {
        console.log("error leads: " + err);
      });
  }

  onRefresh() {
    console.log("button click");
    //console.log(this);
    that.getCustomers();
    that.status = new Date().toString();
  }

  render() {
    return <TabApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  item: {
    padding: 5,
    fontSize: 16,
    height: 36
  }
});
