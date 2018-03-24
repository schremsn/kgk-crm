import React from 'react';
import { View, Text, RefreshControl } from 'react-native';
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
      signedin: false,
      numToday: 0,
      numWeek: 0,
      numOverdue: 0,
      doneThis: 0,
      doneLast: 0,
      numMessages: 0,
      fontLoaded: false,
      refreshing: false,
      wonThis: 0,
      wonLast: 0,
      commission: [],
    };

    i18n.defaultLocale = 'en-US';
    that = this;
  }

  static navigationOptions = {
    tabBarLabel: i18n.t('home'),
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

  /**
   * call back function - call after sign in was successful
   */
  signInComplete() {
    that.loadData()
      .then((data) => {
        console.log(`load reference data ${data}`);
        that.setState({ signedin: true });
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
    const load3 = that.loadLeadTags();
    const load4 = that.loadActivityTypes();
    const load5 = that.retrieveDashboard();
    const load6 = that.getLeadStages();
    const load7 = that.getMessages();
    const load8 = that.getCommissionSummary();

    return Promise.all(load1, load3, load4, load5, load6, load7, load8);
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
        console.log(err);
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
   * get messages for the users channels
  */
  getMessages() {
    const dataprovider = DataProvider.getInstance();
    return dataprovider.getMessages()
      .then((data) => {
        this.setState({ numMessages: data.length });
        return data;
      })
      .catch((err) => {
        console.log(`error messages ${err}`);
        console.log(err);
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
    const won = data.won;
    // const meeting = data.meeting;
    this.setState({ numToday: activity.today });
    this.setState({ numWeek: activity.next_7_days });
    this.setState({ numOverdue: activity.overdue });
    this.setState({ doneThis: done.this_month });
    this.setState({ doneLast: done.last_month });
    this.setState({ wonThis: won.this_month });
    this.setState({ wonLast: won.last_month });
    // this.setState({ meetingToday: meeting.today });
    // this.setState({ meetingWeek: meeting.next_7_days });
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
   * load commission summary for user
   */
  getCommissionSummary() {
    const dataprovider = DataProvider.getInstance();
    const months = 2;
    return dataprovider.getCommissionSummary(months)
      .then((data) => {
        const temp = [];
        if (data) {
          data.forEach((element) => {
            temp.push(element);
          });
        }
        const x = data.length;
        for ( let i = 0; i < x; i++) {
          temp.push({
            end_date: '00-00-00',
            amount: 0.0,
            points: 0,
          });
        }

        this.setState({ commission: temp });
      })
      .catch((err) => {
        console.log(`error commission ${err}`);
        console.log(err);
        return err;
      });
  }

  /** 
   * reload the data for the dashboard
  */
  onRefreshData() {
    that.setState({ refreshing: true });
    that.loadData();
    that.retrieveDashboard();
    that.setState({ refreshing: false });
  }

  /**
   * display commision screen
  */
  onCommission() {
    that.props.navigation.navigate('CommissionOverview');
  }

  /**
   * display messages
  */
  onMessages() {
    that.props.navigation.navigate('MessageList');
  }

  /**
   * display activities screen
  */
  onActivities() {
    that.props.navigation.navigate('Activities');
  }


  /**
   * render the status dashboard
   */
  renderStatus() {
    if (this.state.commission.length === 0) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefreshData}
              title="Loading..."
            />
          }
        >
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
            <CardItem header style={{ backgroundColor: 'forestgreen' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('commission')}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'forestgreen' }}>
              <Text>{i18n.t('this_month')}: {this.state.commission[0].amount}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'forestgreen' }}>
              <Text>{i18n.t('last_month')}: VND 1.200.000</Text>
            </CardItem>
            <CardItem button onPress={this.onCommission} style={{ backgroundColor: 'forestgreen' }}>
              <Text style={{ textAlign: 'center', width: '100%' }}>{i18n.t('details')}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={{ backgroundColor: 'silver' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('messages')}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'silver' }}>
              <Text>{i18n.t('new_messages')}: {this.state.numMessages}</Text>
            </CardItem>
            <CardItem button onPress={this.onMessages} style={{ backgroundColor: 'silver' }}>
              <Text style={{ textAlign: 'center', width: '100%' }}>{i18n.t('details')}</Text>
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
          <Card>
            <CardItem header style={{ backgroundColor: 'dodgerblue' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{i18n.t('opportunity_won')}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text>{i18n.t('this_month')}: {this.state.wonThis}</Text>
            </CardItem>
            <CardItem style={{ backgroundColor: 'dodgerblue' }}>
              <Text>{i18n.t('last_month')}: {this.state.wonLast}</Text>
            </CardItem>
          </Card>
        </Content>
      </View>
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
    return this.renderStatus();
  }
}
