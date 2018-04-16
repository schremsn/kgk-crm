import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { RefreshControl, Text, Image, View, TouchableOpacity, ListView } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import numeral from 'numeral';
import ProgressBar from '../Components/ProgressBar';

import styles from './Styles/ProductsListScreenStyle';
import { Images } from '../Themes';

import { getCommissionSummary } from '../Redux/CommissionRedux';

class LaunchScreen extends Component {
  static navigationOptions = {
    title: I18n.t('home'),
  };
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getCommissionSummary: PropTypes.func.isRequired,
  }
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
  }
  componentWillMount() {
    this.getCommissionList();
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
      const newData = list;
      newData.map(item => data.push(item));
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
      <TouchableOpacity onPress={() => { this.props.navigation.navigate('CommissionListScreen'); }} style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{commission.display_name}</Text>
        <Text style={styles.sectionText}>{I18n.t('id')}: {commission.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('end_date')}: {commission.end_date}</Text>
        <Text style={styles.sectionText}>{I18n.t('amount')}: {numeral(commission.amount).format('0,0')} VND</Text>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        {
          this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View>
            :<ListView
              style={styles.container}
              enableEmptySections
              onEndReached={() => this.getCommissionListNextPage()}
              onEndReachedThreshold={1200}
              dataSource={this.state.dataSource}
              renderRow={item => this.renderCommission(item)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.onRefresh}
                  colors={['#EA0000']}
                  tintColor="white"
                  title={`${I18n.t('loading')}...`}
                  titleColor="white"
                  progressBackgroundColor="white"
                />
              }
            />
        }

      </View>
    );
  }
}
const mapStateToProps = state => ({
  commission: state.commission.commission,
});

const mapDispatchToProps = dispatch => ({
  getCommissionSummary: (month, cb) => { dispatch(getCommissionSummary(month, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen);
