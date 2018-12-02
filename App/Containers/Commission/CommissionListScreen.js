import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, Text, Platform, View, TouchableOpacity, ListView, Alert, BackHandler, NetInfo } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import numeral from 'numeral';
import styles from '../Styles/ContainerStyles';
import { Colors } from '../../Themes/index';
import { getCommissionSummary } from '../../Redux/CommissionRedux';
import { getLeadStatus } from '../../Redux/LeadRedux';
import BaseScreen from '../../Components/BaseScreen';

class CommissionListScreen extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      isFetching: true,
      isRefreshing: false,
      isError: false,
      dataSource: ds.cloneWithRows([]),
    };
    this.getCommissionList = this.getCommissionList.bind(this);
    this.renderCommission = this.renderCommission.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.handleBackAndroid = this.handleBackAndroid.bind(this);
    this.handleCheckNetwork = this.handleCheckNetwork.bind(this);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }
  componentWillMount() {
    this.handleCheckNetwork();
  }
  componentDidMount() {
    this.getCommissionList();
    BackHandler.addEventListener('backPress', this.handleBackAndroid);
    // android
    if (Platform.OS === 'ios') {
      NetInfo.isConnected.fetch().then().done(() => {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleCheckNetwork);
      });
    } else {
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleConnectivityChange,
      );
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('backPress');
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleCheckNetwork,
    );
  }
  handleCheckNetwork(isConnected) {
    if (isConnected) {
      this.getCommissionList();
    }
  }
  handleCheckNetworkAndroid() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.getCommissionList();
      } else {
        Alert.alert(
          'Alert',
          'Network is not connected!',
          [
            {
              text: 'Cancel',
              onPress: () => true,
              style: 'cancel',
            },
            {
              text: 'RETRY',
              onPress: () => {
                setTimeout(() => {
                  this.handleCheckNetwork();
                }, 2000);
              },
            },
          ],
        );
      }
    });
  }
  handleBackAndroid() {
    this.props.navigation.goBack(null);
    return true;
  }
  handleConnectivityChange(isConnected) {
    if (!isConnected) {
      Alert.alert(
        I18n.t('Alert'),
        I18n.t('Network is not connected'),
        [
          {
            text: 'Cancel',
            onPress: () => true,
            style: 'cancel',
          },
          {
            text: 'RETRY',
            onPress: () => {
              setTimeout(() => {
                this.handleCheckNetworkAndroid();
              }, 2000);
            },
          },
        ],
      );
    }
  }
  getCommissionList(isRefreshed) {
    getCommissionSummary()
      .then((list) => {
        console.log('getCommissionSummary', list)
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(list);
        this.setState({
          dataSource,
          isFetching: false,
          isRefreshing: false,
        });
      })
      .catch((e) => {
        this.setState({ isFetching: false, isError: true, isRefreshing: false });
      });
  }
  onRefresh() {
    this.setState({ isRefreshing: true, isError: false });
    this.getCommissionList('isRefreshed');
  }
  renderCommission(commission) {
    return (
      <TouchableOpacity style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{commission.display_name}</Text>
        <Text style={styles.sectionText}>{I18n.t('id')}: {commission.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('end_date')}: {commission.end_date}</Text>
        <Text style={styles.sectionText}>{I18n.t('amount')}: {numeral(commission.amount).format('0,0')} VND</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const {
      isFetching, isRefreshing, isError, dataSource,
    } = this.state;
    return (
      <BaseScreen
        fullLoading={isFetching}
        isError={isError}
        onRefresh={this.onRefresh}
      >
        <ListView
          style={styles.mainContainer}
          enableEmptySections
          dataSource={dataSource}
          renderRow={item => this.renderCommission(item)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
              colors={[Colors.fire]}
              tintColor={Colors.snow}
              title={`${I18n.t('loading')}...`}
              titleColor={Colors.snow}
              progressBackgroundColor={Colors.snow}
            />
          }
        />
      </BaseScreen>
    );
  }
}

CommissionListScreen.navigationOptions = {
  title: I18n.t('home'),
};
CommissionListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};


export default connect(null, null)(CommissionListScreen);
