import React, {Component} from 'react'
import { View, ScrollView, Text, Image } from 'react-native'
import I18n from 'react-native-i18n'
import {connect} from 'react-redux'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import styles from './Styles/ProductDetailScreen'
import { Images } from './../Themes'
import WebViewAutoHeight from '../../App/Components/WebViewAutoHeight'
import {getCommissionStatusDetail} from '../Redux/CommissionRedux'

const data = [
  {name: 'id', value: I18n.t('id')},
  {name: 'identifier', value: I18n.t('identifier')},
  {name: 'partner', value: I18n.t('partner')},
  {name: 'customer', value: I18n.t('customer')},
  {name: 'product', value: I18n.t('product')},
  {name: 'product_category', value: I18n.t('product_category')},
  {name: 'issue', value: I18n.t('issue')},
  {name: 'create_date', value: I18n.t('create_date')},
  {name: 'phone', value: I18n.t('phone')},
  {name: 'mobile', value: I18n.t('mobile')},
  {name: 'notes', value: I18n.t('notes')},
  {name: 'sales_agent', value: I18n.t('sales_agent')},
  {name: 'amount', value: I18n.t('amount')},
  {name: 'mobile', value: I18n.t('mobile')}
]
class CommissionDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      commissionDetail: props.navigation.state.params.commissionDetail,
      commissionMore: {}
    }
    this.renderCard = this.renderCard.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }
  static navigationOptions = {
    title: I18n.t('commission detail')
  };
  componentWillMount () {
    const commissionId = this.props.navigation.state.params.commissionDetail.id
    this.props.getCommissionStatusDetail(commissionId, (commissionMore) => {
      this.setState({commissionMore})
    })
  }
  renderCard (cardTitle, rowData = {}) {
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>{cardTitle.toUpperCase()}</Text>
        </View>
        {this.renderRows(rowData)}
      </View>
    )
  }
  renderRows (rowData) {
    return (
      data.map((item, index) => (<View key={index} style={styles.rowContainer}>
        <View style={styles.rowLabelContainer}>
          <Text style={styles.rowLabel}>{item.value}</Text>
        </View>
        <View style={styles.rowInfoContainer}>
          <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
        </View>
      </View>))
    )
  }
  render () {
    const { commissionDetail, commissionMore } = this.state
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView>
          <View style={{padding: 20}}>
            {this.renderCard(I18n.t('commission_information'), commissionDetail)}
            <ScrollableTabView
              style={{height: 150, padding: 10}}
              initialPage={1}
              renderTabBar={() => <DefaultTabBar backgroundColor='rgba(255, 255, 255, 0.7)' />}
            >
              <View style={styles.cardStyle} tabLabel={I18n.t('status_date')}>
                <Text>{commissionMore.status_date}</Text>
              </View>
              <View style={styles.cardStyle} tabLabel={I18n.t('status')}>
                <Text>{commissionMore.status}</Text>
              </View>
              <View style={styles.cardStyle} tabLabel={I18n.t('changed_by')}>
                <Text> {commissionMore.changed_by}</Text>
              </View>
              <View style={styles.cardStyle} tabLabel={I18n.t('notes')}>
                <Text>{commissionMore.notes}</Text>
              </View>
            </ScrollableTabView>
          </View>

        </ScrollView>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCommissionStatusDetail: (commissionId, cb) => { dispatch(getCommissionStatusDetail(commissionId, cb)) }
  }
}

export default connect(null, mapDispatchToProps)(CommissionDetailScreen)
