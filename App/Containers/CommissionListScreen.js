import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView } from 'react-native'
import I18n from 'react-native-i18n'
import styles from './Styles/ProductsListScreenStyle'
import { Images } from './../Themes'
import ProgressBar from '../Components/ProgressBar'
import {getCommissionStatus} from '../Redux/CommissionRedux'
class CommissionListScreen extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: true,
      isRefreshing: false,
      list: []
    }
  }
  static navigationOptions = {
    title: I18n.t('commission list')
  };
  componentWillMount () {
    this.getCommissionStatusList()
  }
  getCommissionStatusList = (isRefreshed) => {
    this.props.getCommissionStatus(0, (list) => {
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
      const dataSource = ds.cloneWithRows(list)
      this.setState({
        list,
        dataSource,
        isLoading: false
      })
    })
    if (isRefreshed && this.setState({ isRefreshing: false }));
  };
  getCommissionStatusListNextPage = () => {
    this.props.getCommissionStatus(0, (list) => {
      const data = this.state.list
      const newData = list
      newData.map((item, index) => data.push(item))
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data)
      })
    })
  }
  onRefresh = () => {
    this.setState({ isRefreshing: true })
    this.getCommissionStatusList('isRefreshed')
  }
  renderCommission = (item) => (
    <TouchableOpacity onPress={() => { this.props.navigation.navigate('CommissionDetailScreen', {commissionDetail: item}) }} style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>{item.id}</Text>
      <Text style={styles.sectionText}>{I18n.t('identifier')}: {item.identifier}</Text>
      <Text style={styles.sectionText}>{I18n.t('partner')}: {item.partner[1]}</Text>
      <Text style={styles.sectionText}>{I18n.t('customer')}: {item.customer}</Text>
      <Text style={styles.sectionText}>{I18n.t('update_date')}: {item.update_date}</Text>
      <Text style={styles.sectionText}>{I18n.t('issue')}: {item.issue}</Text>
    </TouchableOpacity>
  );
  render () {
    console.log(this.props)
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        {
          this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View>
            : <ListView
              style={styles.container}
              enableEmptySections
              onEndReached={type => this.getCommissionStatusListNextPage()}
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
                  tintColor='white'
                  title={`${I18n.t('loading')}...`}
                  titleColor='white'
                  progressBackgroundColor='white'
                />
              }
            />
        }
      </View>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    offset: state.product.offset
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCommissionStatus: (offset, cb) => { dispatch(getCommissionStatus(offset, cb)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommissionListScreen)
