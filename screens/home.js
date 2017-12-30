import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-material-cards';

import DataProvider from '../lib/dataprovider';
import styles from './stylesheet';
import SignInScreen from './signin';
import ReferenceData from '../data/referencedata';
import i18n from './translation/i18n';


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

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });

    i18n.defaultLocale = 'en-US';
    i18n.locale = 'vn-VN';
  }

  isSignedIn() {
    return this.state.signedin;
  }

  getActivities() {
    console.log(i18n.locale);
    const dataprovider = DataProvider.getInstance();
    dataprovider.getActivities()
      .then((data) => {
        that.setActionCount(data);
      })
      .then(() => {
        that.setState({ data: data });
        that.setState({ signedin: true });
      })
      .catch((err) => {
        console.log(`error activities:  ${err}`);
      });
  }

  /**
   * load data for dashboard and also reference data
   */
  loadData() {
    that.loadUserInfo();
    that.getActivities();
    that.loadLeadTags();
  }

  loadLeadTags() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getLeadTags()
      .then((data) => {
        ReferenceData.getInstance().setLeadTags(data);
      })
      .catch((err) => {
        console.log(`error tags ${err}`);
      });
  }

  loadUserInfo() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getUserInfo()
      .then((data) => {
        ReferenceData.getInstance().setUserInfo(data);
      })
      .then(() => {
        that.loadCompanyInfo();
      })
      .catch((err) => {
        console.log(`error user ${err}`);
      });
  }

  loadCompanyInfo() {
    const id = ReferenceData.getInstance().getUserCompany();
    const dataprovider = DataProvider.getInstance();

    dataprovider.getCompanyInfo(id)
      .then((data) => {
        ReferenceData.getInstance().setCompanyInfo(data);
      })
      .catch((err) => {
        console.log(`error company ${err}`);
      });
  }

  setActionCount(data) {
    let numToday = 0;
    let numWeek = 0;
    let numOverdue = 0;

    const tmpDate = new Date();
    const today = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());
    const nextWeek = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate() + 7);

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
        <SignInScreen done={this.loadData} />
      )
    }
    else if (this.state.data.length === 0) {
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
