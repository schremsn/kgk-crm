import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, Text, Image, View, TouchableOpacity, ListView, Alert, BackHandler, NetInfo } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import numeral from 'numeral';
import ProgressBar from '../Components/ProgressBar';
import styles from './Styles/ContainerStyles';
import { Colors, Images } from '../Themes';
import { getCommissionSummary } from '../Redux/CommissionRedux';

class CommissionListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
    };
    this.getCommissionList = this.getCommissionList.bind(this);
    this.getCommissionListNextPage = this.getCommissionListNextPage.bind(this);
    this.renderCommission = this.renderCommission.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.handleBackAndroid = this.handleBackAndroid.bind(this);
    this.handleCheckNetwork = this.handleCheckNetwork.bind(this);
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
  }
  componentWillMount() {
    this.handleCheckNetwork()
  }
  componentDidMount() {
    BackHandler.addEventListener('backPress', this.handleBackAndroid);

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('backPress');
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }
  handleCheckNetwork(){
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('netword status', isConnected)
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
                  this.handleCheckNetwork()
                }, 2000)
              },
            },
          ],
        );
      }
    });
  }
  handleBackAndroid() {
    Alert.alert(
      'Alert',
      'Do you want to quit the app?',
      [
        {
          text: 'Cancel',
          onPress: () => true,
          style: 'cancel',
        },
        {
          text: 'RETRY',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
    );
    return true;
  }
  handleConnectivityChange(isConnected) {
    console.log(isConnected)
    if(!isConnected){
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
                this.handleCheckNetwork()
              }, 2000)
            },
          },
        ],
      );
    }

  }
  getCommissionList(isRefreshed) {
    this.props.getCommissionSummary(0, (list) => {
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
      const dataSource = ds.cloneWithRows(list);
      this.setState({
        list,
        dataSource,
        isLoading: false,
      });
    });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }
  getCommissionListNextPage() {
    this.props.getCommissionSummary(0, (list) => {
      const data = this.state.list;
      list.map(item => data.push(item));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
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
    const { isLoading, isRefreshing, dataSource } = this.state;
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
              style={styles.mainContainer}
              enableEmptySections
              onEndReached={() => this.getCommissionListNextPage()}
              onEndReachedThreshold={1200}
              dataSource={dataSource}
              renderRow={item => this.renderCommission(item)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              // renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
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
        }

      </View>
    );
  }
}

CommissionListScreen.navigationOptions = {
  title: I18n.t('home'),
};
CommissionListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getCommissionSummary: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  commission: state.commission.commission,
});

const mapDispatchToProps = dispatch => ({
  getCommissionSummary: (month, cb) => { dispatch(getCommissionSummary(month, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(CommissionListScreen);
