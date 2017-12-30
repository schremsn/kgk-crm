import React from 'react';
import { View, FlatList, Button, TouchableOpacity, Text, TextInput } from 'react-native';


import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

let that = null;

export default class SelectCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      searchTerm: '',
    }

    that = this;
  }

  search() {
    const search = that.state.searchTerm;

    const dataprovider = DataProvider.getInstance();
    dataprovider.searchCustomer(search)
      .then((data) => {
        that.setState({ list: data });
      })
      .catch((err) => {
        console.log(`search error ${err}`);
      });
  }

  /**
   * this method will call selectCustomer method from convertlead and and navigate back
   * @param {number} id
   */
  selectCustomer(id) {
    that.props.navigation.state.params.select(id);
    that.props.navigation.goBack();
  }

  renderCustomer(item) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => { this.selectCustomer(item.id); }}
        >
          <View>
            <Text style={styles.itemCustomerName}>{item.name}</Text>
            <Text style={styles.itemCustomerCity}>{item.city}</Text>
            <Text style={styles.itemCustomerMobile}>{item.phone}</Text>
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
            style={{ height: 40, width: '80%', borderStyle: 'solid', borderColor: 'black' }}
          />
          <Button title="Search" onPress={this.search} style={{ width: '20%' }} />
        </View>
        <FlatList
          data={this.state.list}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderCustomer(item)}
        />
      </View>
    );
  }
}
