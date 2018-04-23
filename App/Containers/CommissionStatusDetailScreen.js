import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView, Text, Image, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import ProgressBar from '../Components/ProgressBar';

import styles from './Styles/ProductDetailScreen';
import { Images, Colors } from './../Themes';
import { getCommissionStatusDetail } from '../Redux/CommissionRedux';
import Header from '../Components/Header';

const data = [
  { name: 'id', value: I18n.t('id') },
  { name: 'identifier', value: I18n.t('identifier') },
  { name: 'partner', value: I18n.t('partner') },
  { name: 'customer', value: I18n.t('customer') },
  { name: 'product', value: I18n.t('product') },
  { name: 'product_category', value: I18n.t('product_category') },
  { name: 'issue', value: I18n.t('issue') },
  { name: 'create_date', value: I18n.t('create_date') },
  { name: 'phone', value: I18n.t('phone') },
  { name: 'mobile', value: I18n.t('mobile') },
  { name: 'notes', value: I18n.t('notes') },
  { name: 'sales_agent', value: I18n.t('sales_agent') },
  { name: 'amount', value: I18n.t('amount') },
  { name: 'mobile', value: I18n.t('mobile') },
];
class CommissionStatusDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commissionDetail: props.navigation.state.params.commissionDetail,
      list: props.navigation.state.params.list,
      commissionMore: [],
      isLoading: true
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
  }

  componentWillMount() {
    const commissionId = this.props.navigation.state.params.commissionDetail.id;
    this.props.getCommissionStatusDetail(commissionId, (commissionMore) => {
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
      const dataSource = ds.cloneWithRows(commissionMore);
      this.setState({
        commissionMore,
        dataSource,
        isLoading: false
      });
    });
  }
  renderCard(cardTitle, rowData = {}) {
    return (
      <View>
        {this.renderRows(rowData)}
      </View>
    );
  }
  renderRows(rowData) {
    return (
      data.map(item => (
        <View key={`${item.value}`} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{item.value}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            {
              item.name === 'create_date' ? <Text style={styles.rowInfo}>{moment(rowData[item.name]).format('MM-DD-YYYY')}</Text>
              : <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
            }
          </View>
        </View>
      ))
    );
  }
  renderProduct(item) {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{item.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('id')}: {item.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('status_date')}: {item.status_date}</Text>
        <Text style={styles.sectionText}>{I18n.t('status')}: {item.status}</Text>
        <Text style={styles.sectionText}>{I18n.t('changed_by')}: {item.changed_by}</Text>
        <Text style={styles.sectionText}>{I18n.t('notes')}: {item.notes}</Text>
      </View>
    );
  }
  render() {
    const { commissionDetail } = this.state;
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title="status detail" onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView style={{ padding: 10 }}>
          {this.renderCard(I18n.t('commission_information'), commissionDetail)}
          {
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View>
              : <ListView
                style={styles.container}
                enableEmptySections
                dataSource={this.state.dataSource}
                renderRow={item => this.renderProduct(item)}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              />
            }
        </ScrollView>

      </View>
    );
  }
}
CommissionStatusDetailScreen.navigationOptions = {
  title: I18n.t('commission detail'),
};
CommissionStatusDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getCommissionStatusDetail: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getCommissionStatusDetail: (commissionId, cb) => { dispatch(getCommissionStatusDetail(commissionId, cb)); },
});

export default connect(null, mapDispatchToProps)(CommissionStatusDetailScreen);
