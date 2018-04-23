import React, { Component } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Picker } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import styles from './Styles/ProductDetailScreen';
import { Images, Metrics } from './../Themes';
import { getCommissionStatusDetail } from '../Redux/CommissionRedux';
import moment from "moment/moment";

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
class CommissionDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commissionDetail: props.navigation.state.params.commissionDetail,
      list: props.navigation.state.params.list,
      commissionMore: {},
      language: 'java',
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }
  static navigationOptions = {
    title: I18n.t('commission detail'),
  };
  componentWillMount() {
    const commissionId = this.props.navigation.state.params.commissionDetail.id;
    this.props.getCommissionStatusDetail(commissionId, (commissionMore) => {
      this.setState({ commissionMore });
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
      data.map((item, index) => (
        <View key={`${item}${index}`} style={styles.rowContainer}>
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
  render() {
    const { commissionDetail, list } = this.state;
    const listAfter = list.filter( item => item.id > (commissionDetail.id - 6) && item.id !== commissionDetail.id && item.id < (commissionDetail.id + 5) )
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack(null)}
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
          }}
        >
          <Image source={Images.backButton} />
          <Text style={{
            paddingLeft: 30, paddingTop: 5, color: 'white', fontSize: 25, fontWeight: '700',
          }}
          >{I18n.t('commission detail').toUpperCase()}
          </Text>
        </TouchableOpacity>
        <ScrollView>
          <View style={{ padding: 10 }}>
            {this.renderCard(I18n.t('commission_information'), commissionDetail)}
            <View style={{ padding: 10 }}>
              <View style={{backgroundColor: 'white'}}>
                <Picker
                  selectedValue={this.state.language}
                  style={{ height: 50, width: (Metrics.screenWidth-40) }}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}
                >
                  <Picker.Item label="Identifier" value="identifier" />
                  <Picker.Item label="Partner" value="partner" />
                  <Picker.Item label="Customer" value="customer" />
                  <Picker.Item label="Update date" value="updateDate" />
                  <Picker.Item label="Issue" value="issue" />
                </Picker>
              </View>

              {
                listAfter.map(item => (
                  <View key={item.id} style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeader}>{item.id}</Text>
                    <Text style={styles.sectionText}>{I18n.t('identifier')}: {item.identifier}</Text>
                    <Text style={styles.sectionText}>{I18n.t('partner')}: {item.partner[1]}</Text>
                    <Text style={styles.sectionText}>{I18n.t('customer')}: {item.customer}</Text>
                    <Text style={styles.sectionText}>{I18n.t('update_date')}: {item.update_date}</Text>
                    <Text style={styles.sectionText}>{I18n.t('issue')}: {item.issue}</Text>
                  </View>
                ))
              }
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getCommissionStatusDetail: (commissionId, cb) => { dispatch(getCommissionStatusDetail(commissionId, cb)); },
});

export default connect(null, mapDispatchToProps)(CommissionDetailScreen);
