import React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image
} from "react-native";
import { StackNavigator } from "react-navigation";
import DataProvider from "../lib/dataprovider";
import CustomerDetail from "./customerdetail";

let that = null;
const numberOfCus = 6;
export default class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      customer: [],
      error: null,
      refreshing: false,
      searchTerm: "",
      detail: false,
      customerIndex: numberOfCus
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: "Customer",
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require("../public/ic_customer.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  componentDidMount() {
    console.log("customerlist");
    this.getCustomers();
  }

  getCustomers() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getCustomers(numberOfCus)
      .then(data => {
        console.log("got customers: ");
        this.setState({
          list: data,
          detail: false,
          customerIndex: numberOfCus
        });
      })
      .catch(err => {
        console.log("error customers: " + err);
      });
  }
  getCustomersBeginIndex() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getCustomersBeginIndex(this.state.customerIndex)
      .then(data => {
        console.log("got customers: ");
        this.setState({
          list: this.state.list.concat(data),
          detail: false,
          customerIndex: this.state.customerIndex + numberOfCus
        });
      })
      .catch(err => {
        console.log("error customers: " + err);
      });
  }

  newCustomer() {}

  onPressItem(customer) {
    console.log("press item: " + customer.id);
    this.getCustomer(customer.id);
  }

  getCustomer(id) {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getCustomer(id)
      .then(data => {
        console.log("got customer: " + id);
        this.setState({ customer: data, detail: true });
      })
      .catch(err => {
        console.log("error customer: " + err);
      });
  }

  onSearch() {}

  closeDetails(action, data) {
    that.setState({ detail: false });
  }

  renderCustomer(item) {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.onPressItem(item);
          }}
        >
          <View style={styles.item}>
            <View style={styles.left}>
              <View style={styles.circle}>
                <Text style={{ fontSize: 20 }}>{item.name[0]}</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCity}>{item.city}</Text>
              <Text>{item.mobile}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B"
        }}
      />
    );
  };

  refresh() {
    this.setState({ refreshing: true });
    this.getCustomers();
    this.setState({ refreshing: false });
  }
  render() {
    if (this.state.detail) {
      return (
        <CustomerDetail
          customer={this.state.customer[0]}
          onClose={this.closeDetails}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-start",
              maxHeight: 35
            }}
          >
            <TextInput
              placeHolder="Customer search"
              onChangeText={text => this.setState({ password: text })}
              style={{ width: "80%" }}
            />
            <Button
              title="Search"
              onPress={this.onSearch}
              style={{ width: "20%" }}
            />
          </View>
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={() => this.refresh()}
            onEndReachedThreshold={this.state.customerIndex}
            onEndReached={() => this.getCustomersBeginIndex()}
            data={this.state.list}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.renderCustomer(item)}
          />
          <View>
            <TouchableHighlight
              style={styles.newbutton}
              underlayColor="#ff7043"
              onPress={this.newCustomer}
            >
              <Text style={{ fontSize: 50, color: "white" }}>+</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: 50
  },
  left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  right: { flex: 5, marginLeft: 30 },
  itemName: {
    fontSize: 22,
    fontWeight: "bold"
  },
  icon: {
    width: 20,
    height: 20
  },
  container: {
    marginTop: 22,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%"
  },
  item: {
    padding: 5,

    height: 100,
    width: "100%",
    flexDirection: "row",
    padding: 10
  },
  itemCity: {},
  itemMobile: {},
  newbutton: {
    backgroundColor: "#ff5722",
    borderColor: "#ff5722",
    borderWidth: 1,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
