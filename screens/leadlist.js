import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet'
const numberOfLead = 6;
export default class Leadlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      leadList: [],
      error: null,
      refreshing: false,

      leadIndex: numberOfLead,
    };
  }
  static navigationOptions = {
    tabBarLabel: 'Leads',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../public/ic_customer.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ),
  };

  refresh() {
    this.setState({ refreshing: true });
    this.getLeads();
    this.setState({ refreshing: false });
  }
  componentDidMount() {
    console.log('leadlist');
    this.setState({ refreshing: true });
    this.getLeads();
    this.setState({ refreshing: false });
  }

  getLeads() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getLeads()
      .then(data => {
        console.log('got leads: ');
        this.setState({ leadList: data });
      })
      .catch(err => {
        console.log('error leads: ' + err);
      });
  }
  getLeadsBeginIndex() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getLeadsBeginIndex(this.state.leadIndex)
      .then(data => {
        console.log('got leads: ');
        this.setState({
          leadList: this.state.leadList.concat(data),
          leadIndex: this.state.index + numberOfLead,
        });
      })
      .catch(err => {
        console.log('error leads: ' + err);
      });
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

  renderLead(item) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('LeadDetail', { lead: item });
        }}
      >
        <View style={styles.itemLead}>
          <Text style={styles.itemLeadName}>Name: {item.name}</Text>
          <Text style={styles.itemContactName}>Contact Name: {item.contact_name}</Text>
          <Text >{item.title_action}</Text>
        </View>
      </TouchableOpacity>

    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
          onEndReachedThreshold={this.state.LeadIndex}
          onEndReached={() => this.getLeadsBeginIndex()}
          data={this.state.leadList}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderLead(item)}
        />
      </View>
    );
  }
}