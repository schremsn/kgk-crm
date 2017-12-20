import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';

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
  };

  refresh() {
    this.setState({ refreshing: true });
    this.getLeads();
    this.setState({ refreshing: false });
  }
  componentDidMount() {
    this.setState({ refreshing: true });
    this.getLeads();
    this.setState({ refreshing: false });
  }

  /**
   * retrieve leads with optional starting index for pagination
   * @param {number} index
   */
  getLeads(index = 0) {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getLeads()
      .then(data => {
        console.log('got leads: ');
        this.setState({ leadList: data });
        leadIndex: this.state.index + numberOfLead,
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
          onEndReached={() => this.getLeads(this.state.leadIndex)}
          data={this.state.leadList}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderLead(item)}
        />
      </View>
    );
  }
}