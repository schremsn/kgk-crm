import React from 'react';
import { View, FlatList, Text, TouchableHighlight } from 'react-native';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import FlatListItemSeparator from './components/listseparator';
import i18n from './translation/i18n';


let that = null;

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      refreshing: false,
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: i18n.t('home'),
  };

  componentWillMount() {
    this.getMessages();
  }

  /**
   * retrieve activities
  */
  getMessages() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getMessages()
      .then((data) => {
        that.setState({ messages: data });
      })
      .catch((err) => {
        console.log(`error messages:  ${err}`);
      });
  }

  /** 
   * event handler to refresh list
  */
  onRefresh() {
    this.setState({ refreshing: true });
    this.getMessages();
    this.setState({ refreshing: false });
  }

  /**
   * event handler for selected message
   * @param {object} message
   */
  onMessage(message) {
    console.log(message);
  }

  renderMessage(item) {
    return (
      <TouchableHighlight
        onPress={() => this.onMessage(item)}
      >
        <View>
          <Text>date: {item.date}</Text>
          <Text>messagetype: {item.message_type}</Text>
          <Text>channel: {item.channel_ids}</Text>
          <Text>subtype: {item.subtype_id[1]}</Text>
          <Text>{item.body}</Text>
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
          onEndReached={() => this.getMessages()}
          data={this.state.messages}
          ItemSeparatorComponent={FlatListItemSeparator}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => this.renderMessage(item)}
        />
      </View>
    );
  }
}
