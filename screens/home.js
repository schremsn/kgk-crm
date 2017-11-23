import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet'

let that = null;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: true,
      signedin: true,
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Home',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../public/ic_home.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ),
  };

  componentDidMount() {
    console.log('home mounted');
  }

  isSignedIn() {
    return this.state.signedin;
  }

  getActivities() {
    let dataprovider = DataProvider.getInstance();
    dataprovider
      .getActivities()
      .then(data => {
        console.log('got activities: ' + data);
        that.setState({ data: data });
        that.setState({ signedin: true });
      })
      .catch(err => {
        console.log('error activities: ' + err);
      });
  }

  renderActivity(item) {
    return (
      <View>
        <Text style={styles.itemHome}>{item.display_name}</Text>
        <Text style={styles.itemHome}>{item.description}</Text>
        <Text style={styles.itemHome}>{item.body}</Text>
        <Text style={styles.itemHome}>{item.create_date}</Text>
        <Text style={styles.itemHome}>{item.message_type}</Text>
        <Text style={styles.itemHome}>{item.channel_id}</Text>
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
    if (this.state.data.length == 0) {
      console.log('render home if');
      return (
        <View style={styles.container}>
          <Text style={styles.mess}>Nothing to do</Text>
        </View>
      );
    } else {
      console.log('render home else');
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.renderActivity(item)}
          />
        </View>
      );
    }
  }
}
