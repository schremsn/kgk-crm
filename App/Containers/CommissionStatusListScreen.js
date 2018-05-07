import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';
import { Images, Colors } from './../Themes';
import styles from './Styles/ContainerStyles';
import ProgressBar from '../Components/ProgressBar';
import Header from '../Components/Header';
import { getCommissionStatus } from '../Redux/CommissionRedux';

class CommissionStatusListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
      list: [],
    };
    this.getCommissionStatusList = this.getCommissionStatusList.bind(this);
    this.getCommissionStatusListNextPage = this.getCommissionStatusListNextPage.bind(this);
    this.renderCommission = this.renderCommission.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.getCommissionStatusList();
  }
  getCommissionStatusList(isRefreshed) {
    this.props.getCommissionStatus(0, (list) => {
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
      const dataSource = ds.cloneWithRows(list);
      this.setState({
        list,
        dataSource,
        isLoading: false,
      });
    });
    if (isRefreshed) {
      this.setState({ isRefreshing: false });
    }
  }
  getCommissionStatusListNextPage() {
    this.props.getCommissionStatus(0, (list) => {
      const data = this.state.list;
      list.map(item => data.push(item));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getCommissionStatusList('isRefreshed');
  }
  renderCommission(item) {
    return (
      <TouchableOpacity
        onPress={() => { this.props.navigation.navigate('CommissionStatusDetailScreen', { commissionDetail: item }); }}
        style={styles.sectionHeaderContainer}
      >
        <Text style={styles.sectionHeader}>{item.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('identifier')}: {item.identifier}</Text>
        <Text style={styles.sectionText}>{I18n.t('partner')}: {item.partner[1]}</Text>
        <Text style={styles.sectionText}>{I18n.t('customer')}: {item.customer}</Text>
        <Text style={styles.sectionText}>{I18n.t('update_date')}: {item.update_date && moment(item.update_date).format('MM-DD-YYYY')}</Text>
        <Text style={styles.sectionText}>{I18n.t('issue')}: {item.issue}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const { isLoading, isRefreshing, dataSource } = this.state;
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('status')} onPress={() => this.props.navigation.goBack(null)} />
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
              style={styles.mainContainer}
              enableEmptySections
              onEndReached={() => this.getCommissionStatusListNextPage()}
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

const mapStateToProps = state => ({
  offset: state.product.offset,
});

const mapDispatchToProps = dispatch => ({
  getCommissionStatus: (offset, cb) => { dispatch(getCommissionStatus(offset, cb)); },
});

CommissionStatusListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getCommissionStatus: PropTypes.func.isRequired,
};
CommissionStatusListScreen.navigationOptions = {
  title: I18n.t('commission list'),
};

export default connect(mapStateToProps, mapDispatchToProps)(CommissionStatusListScreen);
