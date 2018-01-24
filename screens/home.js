import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Container, Content, Card, CardItem, Toast } from 'native-base';
import { Font, AppLoading } from 'expo';

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
      data: [],
      signedin: false,
      numToday: 0,
      numWeek: 0,
      numOverdue: 0,
      doneThis: 0,
      doneLast: 0,
      meetingToday: 0,
      meetingWeek: 0,
      detail: false,
      fontLoaded: false,
      detail: false,
    };

    i18n.defaultLocale = 'en-US';
    that = this;
  }

  static navigationOptions = {
    tabBarLabel: 'Home',
  };

  componentWillMount() {
    this.startup()
      .then(() => {
        this.setState({ fontLoaded: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * load fonts and icons
   */
  async startup() {
    const load = Font.loadAsync({ Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')});
    const load2 = Font.loadAsync({ Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf') });
    const load3 = Font.loadAsync({ Roboto: require('native-base/Fonts/Roboto.ttf') });
    return Promise.all(load, load2, load3);
  }

  isSignedIn() {
    return this.state.signedin;
  }

  getActivities() {
    const dataprovider = DataProvider.getInstance();
    dataprovider.getActivities()
      .then((data) => {
        that.setState({ data: data });
      })
      .then(() => {
        that.setState({ signedin: true });
      })
      .catch((err) => {
        console.log(`error activities:  ${err}`);
      });
  }

  /**
   * call back function - call after sign in was successful
   */
  signInComplete() {
    that.loadData()
      .then((data) => {
        console.log(`load reference data ${data}`);
      })
      .catch((err) => {
        let temp = i18n.t('err_reference_data');
        temp = temp.concat(`: ${err}`);
        console.log(temp);
        Toast.show({
          text: temp,
          position: 'bottom',
          buttonText: 'Ok',
        });
      });
  }

  /**
   * load data for dashboard and also reference data
   */
  async loadData() {
    const load1 = that.loadUserInfo();
    const load2 = that.getActivities();
    const load3 = that.loadLeadTags();
    const load4 = that.loadActivityTypes();
    const load5 = that.retrieveDashboard();
    const load6 = that.getLeadStages();

    return Promise.all(load1, load2, load3, load4, load5, load6);
  }

  /**
   * get activity types
   */
  loadActivityTypes() {
    const dataprovider = DataProvider.getInstance();
    return dataprovider.getActivityTypes()
      .then((data) => {
        ReferenceData.getInstance().setActivityTypes(data);
        return data;
      })
      .catch((err) => {
        console.log(`error action types:  ${err}`);
        return err;
      });
  }


  /**
   * get sales dashboard data
   */
  retrieveDashboard() {
    const dataprovider = DataProvider.getInstance();
    return dataprovider.retrieveDashboard()
      .then((data) => {
        this.parseDashboardData(data);
        return data;
      })
      .catch((err) => {
        console.log(`error dashboard ${err}`);
        return err;
      });
  }

  /**
   * set state for the numbers in the dashboard
   * @param {array} data
   */
  parseDashboardData(data) {
    if (data === undefined) {
      return;
    }
    const activity = data.activity;
    const done = data.done;
    const meeting = data.meeting;
    this.setState({ numToday: activity.today });
    this.setState({ numWeek: activity.next_7_days });
    this.setState({ numOverdue: activity.overdue });
    this.setState({ doneThis: done.this_month });
    this.setState({ doneLast: done.last_month });
    this.setState({ meetingToday: meeting.today });
    this.setState({ meetingWeek: meeting.next_7_days });
  }

  /**
   * load all defined lead tags
   */
  loadLeadTags() {
    const dataprovider = DataProvider.getInstance();
    return dataprovider.getLeadTags()
      .then((data) => {
        ReferenceData.getInstance().setLeadTags(data);
        return data;
      })
      .catch((err) => {
        console.log(`error tags ${err}`);
        return err;
      });
  }

  /**
   * load all defined lead stages
   */
  getLeadStages() {
    const dataprovider = DataProvider.getInstance();
    return dataprovider.getLeadStages()
      .then((data) => {
        ReferenceData.getInstance().setLeadStages(data);
        return data;
      })
      .catch((err) => {
        console.log(`error stages ${err}`);
        return err;
      });
  }

  /**
   * load user info such as locale, default company
   */
  loadUserInfo() {
    const dataprovider = DataProvider.getInstance();
    return dataprovider.getUserInfo()
      .then((data) => {
        ReferenceData.getInstance().setUserInfo(data);
      })
      .then(() => {
        that.loadCompanyInfo();
      })
      .catch((err) => {
        console.log(`error user ${err}`);
        return err;
      });
  }

  /**
   * load company info
   */
  loadCompanyInfo() {
    const id = ReferenceData.getInstance().getUserCompany();
    const dataprovider = DataProvider.getInstance();

    return dataprovider.getCompanyInfo(id)
      .then((data) => {
        ReferenceData.getInstance().setCompanyInfo(data);
        return data;
      })
      .catch((err) => {
        console.log(`error company ${err}`);
        return err;
      });
  }

  /**
   * switch back to dashboard
   */
  onDashboard() {
    that.setState({ detail: false });
  }

  /**
   * display list of next actvities
   */
  onActivities() {
    that.setState({ detail: true });
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


  /**
   * render the status dashboard
   */
  renderStatus() {
    return (
      <Container style={{ padding: 5 }}>
        <Content>
          <Card>
            <CardItem header style={{ backgroundColor: 'dodgerblue' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('activities')}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text>{i18n.t('today')}: {this.state.numToday}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text>{i18n.t('next_7_days')}: {this.state.numWeek}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text style={{ color: 'red' }}>{i18n.t('overdue')}: {this.state.numOverdue}</Text>
            </CardItem>
            <CardItem button onPress={this.onActivities} style={{ backgroundColor: 'dodgerblue' }}>
              <Text style={{ textAlign: 'center', width: '100%' }}>{i18n.t('details')}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={{ backgroundColor: 'silver' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('meetings')}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'silver' }}>
              <Text>{i18n.t('today')}: {this.state.meetingToday}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'silver' }}>
              <Text>{i18n.t('next_7_days')}: {this.state.meetingWeek}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={{ backgroundColor: 'orange' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('activities_done')}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'orange' }}>
              <Text>{i18n.t('this_month')}: {this.state.doneThis}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'orange' }}>
              <Text>{i18n.t('last_month')}: {this.state.doneLast}</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }

  render() {
    if (!this.state.fontLoaded) {
      return (
        <AppLoading />
      );
    }
    if (!this.isSignedIn()) {
      return (
        <SignInScreen done={this.signInComplete} />
      );
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
              onPress={this.onDashboard}
            >
              <Text style={{ fontSize: 40, color: 'white' }}>&#60;</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
    return this.renderStatus();
  }
}
