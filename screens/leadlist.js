import React from 'react';
import { Text, View, FlatList, TextInput, TouchableHighlight, Button } from 'react-native';
import { Toast } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import i18n from './translation/i18n';
import FlatListItemSeparator from './components/listseparator';

let that = null;

export default class Leadlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leadList: [],
      refreshing: false,
      stage: [],
    };

    this.offset = 0;

    that = this;
  }
  
  static navigationOptions = ({ navigation }) => {
    const temp = navigation.state.params.stage.name;
    return { headerTitle: temp, tabBarLabel: i18n.t('lead') };
  };

  /**
   * refresh the data after pull down
   */
  refresh() {
    this.setState({ refreshing: true });
    this.getLeads(this.state.stage.id);
    this.setState({ refreshing: false });
  }

  componentWillMount() {
    const stageId = this.props.navigation.state.params.stage.id;
    this.setState({ refreshing: true });
    this.setState({ stage: stageId });
    this.getLeads(stageId);
    this.setState({ refreshing: false });
  }

  /**
   * retrieve leads with optional starting index for pagination
   * @param {number} stageid
   * @param {number} index
   */
  getLeads(stageid, index = 0) {
    if (stageid === undefined) {
      return;
    }
    const dataprovider = DataProvider.getInstance();
    dataprovider.getLeadbyStage(stageid, index)
      .then((data) => {
        that.setState({ leadList: that.state.leadList.concat(data) });
        that.offset = index + data.length;
      })
      .catch((err) => {
        console.log(`error leads: ${err}`);
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
        console.log(`error lead search: ${err}`);
      });
  }

  /**
   * navigate to leadcreate screen
   */
  newLead() {
    that.props.navigation.navigate('LeadCreate', { stageid: that.state.stage.id });
  }


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
          <Text style={col}>{item.name}</Text>
          <Text>{i18n.t('customer')}: {item.partner_name}</Text>
          <Text style={styles.itemContactName}>{i18n.t('contact_name')}: {item.contact_name}</Text>
          <Text>{i18n.t('city')}: {item.city}</Text>
          <Text>{i18n.t('phone')}: {item.phone}</Text>
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
            placeholder={i18n.t('lead_search')}
            onChangeText={text => this.setState({ searchTerm: text })}
            style={{ height: 40, width: '80%', borderStyle: 'solid', borderColor: 'red' }}
          />
          <Button title={i18n.t('search')} onPress={this.onSearch} style={{ width: '20%' }} />
        </View>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
          onEndReachedThreshold={1}
          onEndReached={() => this.getLeads(this.state.stage.id, this.offset)}
          data={this.state.leadList}
          ItemSeparatorComponent={FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderLead(item)}
        />
        <View>
          <TouchableHighlight
            style={styles.newCustomerbutton}
            underlayColor="#ff7043"
            onPress={this.newLead}
          >
            <Text style={{ fontSize: 50, color: 'white' }}>+</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
