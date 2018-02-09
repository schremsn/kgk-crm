import React from 'react';
import { Text, View, FlatList, TextInput, Button, TouchableHighlight } from 'react-native';
import { Container, Content, Card, CardItem, Toast } from 'native-base';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import FlatListItemSeparator from './components/listseparator';
import i18n from './translation/i18n';
import ReferenceData from '../data/referencedata';
import Util from '../common/util';

let that = null;

export default class Stages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stages: ReferenceData.getInstance().getLeadStages(),
      leads: [],
      counts: new Map(),
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
  componentWillMount() {
    this.getLeads();
    this.getPipeline();
  }

  /**
   * refresh the display
   */
  refresh() {
    this.setState({ refreshing: true });
    this.getPipeline();
    this.setState({ refreshing: false });
  }

  /**
   * get the lead counts per stage
   */
  getPipeline() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.pipelineCount()
      .then((data) => {
        this.setState({ counts: data });
      })
      .catch((err) => {
        console.log(`Get pipeline ${err}`);
        console.log(err);
      });
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

  /**
   * displays a list of leads based on the selected stage
   * @param {number} stage
   */
  selectStage(stage) {
    that.props.navigation.navigate('LeadList', { stage: stage });
  }

  /**
   * return the count for the stage id
   * @param {number} id
   */
  getCount(id) {
    return this.state.counts[id];
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
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text style={styles.itemLeadName}>{item.name}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text>{this.getCount(item.id)}</Text>
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
