import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import FlatListItemSeparator from './components/listseparator';
import i18n from './translation/i18n';

let that = null;

export default class Actvities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      refreshing: false,
      offset: 0,
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Home',
  };

  componentWillMount() {
    this.getActivities();
  }

  /**
   * retrieve activities
  */
  getActivities(offset = 0) {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getActivities(offset)
      .then((data) => {
        that.setState({ activities: data });
      })
      .catch((err) => {
        console.log(`error activities:  ${err}`);
        console.log(err);
      });
  }

  /**
   * reload data
  */
  onRefresh() {
    that.getActivities(0);
  }

  /**
   * activity selected
   * @param {any} activity
   */
  onActivity(activity) {
    console.log(activity);
  }

  renderActivity(item) {
    return (
      <TouchableHighlight
        onPress={() => this.onActivity(item)}
      >
        <View style={styles.itemLead}>
          <Text>{item.name}</Text>
          <Text>{item.date_deadline}</Text>
          <Text>{item.contact_name}</Text>
          <Text>{item.phone}</Text>
        </View>
      </TouchableHighlight>

    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this.onRefresh()}
          onEndReachedThreshold={1}
          onEndReached={() => this.getActivities(this.offset)}
          data={this.state.activities}
          ItemSeparatorComponent={FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderActivity(item)}
        />
      </View>
    );
  }
}
