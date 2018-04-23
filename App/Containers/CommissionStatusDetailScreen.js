import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, Image, TouchableOpacity, Picker } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import moment from 'moment/moment';

import styles from './Styles/ProductDetailScreen';
import { Images, Metrics } from './../Themes';
import { getCommissionStatusDetail } from '../Redux/CommissionRedux';

const data = [
  { name: 'id', value: I18n.t('id') },
  { name: 'status_date', value: I18n.t('status_date') },
  { name: 'status', value: I18n.t('status') },
  { name: 'changed_by', value: I18n.t('changed_by') },
  { name: 'notes', value: I18n.t('notes') },
];
class CommissionStatusDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commissionDetail: props.navigation.state.params.commissionDetail,
      list: props.navigation.state.params.list,
      commissionMore: {},
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

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
        <View key={`${item.value}${index}`} style={styles.rowContainer}>
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
    const { commissionDetail, list, commissionMore } = this.state;
    const listAfter = list.filter(item => item.id > (commissionDetail.id - 6) && item.id !== commissionDetail.id && item.id < (commissionDetail.id + 5));
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
        <View style={{ padding: 10 }}>
          {this.renderCard(I18n.t('commission_information'), commissionMore)}
        </View>
        <ScrollView style={{ padding: 20 }}>
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
