import React from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Button } from 'react-native';
import { Toast } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import i18n from './translation/i18n';

let that = null;

export default class Leadlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leadList: [],
      refreshing: false,
    };

    this.offset = 0;

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Lead',
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
    console.log(`getleads  ${index}`);
    const dataprovider = DataProvider.getInstance();
    dataprovider.getLeads(index)
      .then((data) => {
        that.setState({ leadList: that.state.leadList.concat(data) });
        that.offset = index + data.length;
        console.log(`new index  ${that.offset}`);
      })
      .catch((err) => {
        console.log(`error leads: ${err}`);
        Toast.show({
          text: `error loading leads: ${err}`,
          position: 'bottom',
          buttonText: 'Retry',
        });
      });
  }

  /**
   * search for leads
   */
  onSearch() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.searchLead(that.state.searchTerm)
      .then((data) => {
        console.log(data.length);
        that.setState({ list: data });
      })
      .catch((err) => {
        console.log(`error customer search: ${err}`);
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
    let col = styles.leadColor;
    if (item.type.toUpperCase() === 'opportunity'.toUpperCase()) {
      col = styles.opportunityColor;
    }

    return (
      <TouchableHighlight
        onPress={() => {
          this.props.navigation.navigate('LeadDetail', { leadId: item.id });
        }}
      >
        <View style={styles.itemLead}>
          <Text style={col}>Name: {item.name}</Text>
          <Text style={styles.itemContactName}>Contact Name: {item.contact_name}</Text>
          <Text >{item.id}</Text>
        </View>
      </TouchableHighlight>

    );
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
            placeholder={i18n.t('customerSearchPlaceHolder')}
            onChangeText={text => this.setState({ searchTerm: text })}
            style={{ height: 40, width: '80%', borderStyle: 'solid', borderColor: 'red' }}
          />
          <Button title={i18n.t('search')} onPress={this.onSearch} style={{ width: '20%' }} />
        </View>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
          initialNumToRender={10}
          onEndReachedThreshold={5}
          onEndReached={() => this.getLeads(this.offset)}
          data={this.state.leadList}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderLead(item)}
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
