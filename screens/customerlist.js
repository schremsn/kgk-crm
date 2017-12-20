import React from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet'

let that = null;
const numberOfCustomer = 6;

export default class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      customer: [],
      error: null,
      refreshing: false,
      searchTerm: '',
      customerIndex: numberOfCustomer,
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Customer',
  };

  componentDidMount() {
    console.log('customerlist');
    this.getCustomers();
  }

  getCustomers() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getCustomers(numberOfCustomer)
      .then(data => {
        console.log('got customers: ');
        this.setState({
          list: data,
          customerIndex: numberOfCustomer,
        });
      })
      .catch(err => {
        console.log('error customers: ' + err);
      });
  }
  getCustomersBeginIndex() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getCustomersBeginIndex(this.state.customerIndex)
      .then(data => {
        console.log('got customers: ');
        this.setState({
          list: this.state.list.concat(data),
          customerIndex: this.state.customerIndex + numberOfCustomer,
        });
      })
      .catch(err => {
        console.log('error customers: ' + err);
      });
  }

  createCustomer() { }

  onPressItem(customer) {
    console.log('press item: ' + customer.id);
    this.getCustomer(customer.id);
  }

  getCustomer(id) {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getCustomer(id)
      .then(data => {

        this.setState({ customer: data, detail: true });
        return data;
      })
      .catch(err => {
        console.log('error customer: ' + err);
      });
  }

  /**
   * search for customers based on the entered search term
   */
  onSearch() {
    let dataprovider = DataProvider.getInstance();
    dataprovider.searchCustomer(that.state.searchTerm)
      .then(data => {
        console.log(data.length);
        that.setState({ list: data });
      })
      .catch(err => {
        console.log('error customer search: ' + err);
      });
  }

  closeDetails(action, data) {
    that.setState({ detail: false });
  }
  renderCustomer(item) {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigate('CustomerDetail', { customerId: item.id });
          }}
        >
          <View style={styles.itemCustomer}>
            <View style={styles.itemCustomerLeft}>
              <View style={styles.circle}>
                <Text style={{ fontSize: 20 }}>{item.name[0]}</Text>
              </View>
            </View>
            <View style={styles.itemCustomerRight}>
              <Text style={styles.itemCustomerName}>{item.name}</Text>
              <Text style={styles.itemCustomerCity}>{item.city}</Text>
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
          width: '100%',
          backgroundColor: '#607D8B',
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
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            maxHeight: 35,
            minHeight: 35,
          }}
        >
          <TextInput
            placeholder="search for name or city"
            onChangeText={text => this.setState({ searchTerm: text })}
            style={{ height: 40, width: '80%', borderStyle: 'solid', borderColor: 'red' }}
          />
          <Button title="Search" onPress={this.onSearch} style={{ width: '20%' }} />
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
            style={styles.newCustomerbutton}
            underlayColor="#ff7043"
            onPress={this.newCustomer}
          >
            <Text style={{ fontSize: 50, color: 'white' }}>+</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

