import React, { Component } from 'react'
import {RefreshControl, Text, Image, View, TouchableOpacity, ScrollView} from 'react-native'
import { Images } from '../Themes'
import numeral from 'numeral'
// Styles
import styles from './Styles/ProductsListScreenStyle'
import I18n from 'react-native-i18n'
import {connect} from "react-redux";
import {getCommissionSummary} from "../Redux/CommissionRedux";

class LaunchScreen extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: true,
      isRefreshing: false
    }
  }
  static navigationOptions = {
    title: I18n.t('home')
  };
  getCommissionList = (isRefreshed) => {
    this.props.getCommissionSummary()
    if (isRefreshed && this.setState({ isRefreshing: false }));
  };
  onRefresh = () => {
    this.setState({isRefreshing: true});
    this.getCommissionList('isRefreshed')
  }
  render () {
    const { commission } = this.props
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              colors={['#EA0000']}
              tintColor='white'
              title={`${I18n.t('loading')}...`}
              titleColor='white'
              progressBackgroundColor='white'
            />
          }
        >
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('CommissionListScreen') }} style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{commission.display_name}</Text>
            <Text style={styles.sectionText}>{I18n.t('id')}: {commission.id}</Text>
            <Text style={styles.sectionText}>{I18n.t('end_date')}: {commission.end_date}</Text>
            <Text style={styles.sectionText}>{I18n.t('amount')}: {numeral(commission.amount).format('0,0')} VND</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    commission: state.commission.commission
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCommissionSummary: () => { dispatch(getCommissionSummary()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
