import React from 'react';
import { Text, View, FlatList, TextInput, Button, TouchableHighlight } from 'react-native';
import { Container, Content, Card, CardItem, Toast } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import FlatListItemSeparator from './components/listseparator';
import i18n from './translation/i18n';
import ReferenceData from '../data/referencedata';

let that = null;

export default class Stages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stages: ReferenceData.getInstance().getLeadStages(),
      leads: [],
      refreshing: false,
    };

    this.offset = 0;

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Lead',
  };

  /**
   * load leads before screen is displayed
   */
  componentDidMount() {
    this.getLeads();
  }

  /**
   * refresh the display
   */
  refresh() {
    console.log('refresh');
    this.setState({ refreshing: true });
    this.getLeads();
    this.setState({ refreshing: false });
  }

  /**
   * load leads
   */
  getLeads() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getLeads()
      .then((data) => {
        this.setState({ leads: data });
      })
      .catch((err) => {
        console.log(`Get leads ${err}`);
      });
  }

  selectStage(stage) {
    console.log(stage);
  }

  renderStage(item) {
    return (
      <TouchableHighlight
        onPress={() => {
          this.selectStage(item);
        }}
      >
        <View>
          <Card>
            <CardItem>
              <Text style={styles.itemLeadName}>{item.name}</Text>
            </CardItem>
            <CardItem>
              <Text>{this.state.leads.length}</Text>
            </CardItem>
          </Card>
        </View>
      </TouchableHighlight>

    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
          data={this.state.stages}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderStage(item)}
        />
      </View>
    );
  }
}
