import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableHighlight } from 'react-native';
import { StackNavigator } from 'react-navigation';
import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import SignInScreen from './signin';

import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'

let that = null;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: true,
      signedin: false,
      numToday: 0,
      numWeek: 0,
      numOverdue: 0,
      detail: false,
    };

    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Home',
  };


  isSignedIn() {
    return this.state.signedin;
  }

  getActivities() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getActivities()
      .then(data => {
        console.log('got activities: ' + data);
        that.setActionCount(data);
        that.setState({ data: data });
        that.setState({ signedin: true });
      })
      .catch(err => {
        console.log('error activities: ' + err);
      });
  }

  setActionCount(data) {
    let numToday = 0;
    let numWeek = 0;
    let numOverdue = 0;

    tmpDate = new Date();
    today = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());
    nextWeek = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate() + 7);

    for (let item in data) {
      activity = data[item]
      strDate = activity['date_action'];
      dateDue = new Date(strDate);

      if (dateDue > today && dateDue < nextWeek) {
        numWeek++;
      }
      else if (dateDue < today) {
        numOverdue++;
      }
      else {
        numToday++;
      }
    }

    that.setState({ numWeek: numWeek });
    that.setState({ numTday: numToday });
    that.setState({ numOverdue: numOverdue });
  }

  dashboard() {
    that.setState({ detail: false });
  }

  renderActivity(item) {
    return (
      <View>
        <Text style={styles.headerHome}>{item.title_action}</Text>
        <Text style={styles.itemHome}>{item.name}</Text>
        <Text style={styles.itemHome}>{item.contact_name}</Text>
        <Text style={styles.itemHome}>{item.date_action}</Text>
        <Text style={styles.itemHome}>{item.city}</Text>
        <Text style={styles.itemHome}>{item.phone}</Text>
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


  renderStatus() {
    return (
      <View style={styles.container}>
        <Text style={styles.HeaderHome}>To do</Text>
        <Card style={{ backgroundColor: 'lightblue' }}>
          <CardTitle title='Today' />
          <CardContent text={this.state.numToday} />
          <CardAction seperator={false} inColumn={false}>
            <CardButton
              onPress={() => { that.setState({ detail: true }) }}
              title='Details'
              color='blue'
            />
          </CardAction>
        </Card>
        <Card style={{ backgroundColor: 'grey' }}>
          <CardTitle title='Next 7 days' />
          <CardContent text={this.state.numWeek} />
          <CardAction seperator={false} inColumn={false}>
            <CardButton
              onPress={() => { that.setState({ detail: true }) }}
              title='Details'
              color='blue'
            />
          </CardAction>
        </Card>
        <Card style={{ backgroundColor: 'orange' }}>
          <CardTitle title='Overdue' />
          <CardContent text={this.state.numOverdue} />
          <CardAction seperator={false} inColumn={false}>
            <CardButton
              onPress={() => { that.setState({ detail: true }) }}
              title='Details'
              color='blue'
            />
          </CardAction>
        </Card>
      </View>
    );
  }

  render() {
    if (!this.isSignedIn()) {
      return (
        <SignInScreen done={this.getActivities} />
      )
    }
    else if (this.state.data.length == 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.mess}>Nothing to do</Text>
        </View>
      );
    }
    else if (this.state.detail) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.renderActivity(item)}
          />
          <View>
            <TouchableHighlight
              style={styles.newCustomerbutton}
              underlayColor="#ff7043"
              onPress={this.dashboard}
            >
              <Text style={{ fontSize: 40, color: 'white' }}>&#60;</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
    else {
      return this.renderStatus()
    }
  }
}
