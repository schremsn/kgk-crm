import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, AsyncStorage, Text, Image, TouchableOpacity, RefreshControl, ListView } from 'react-native'

import DataProvider from '../Lib/dataprovider'
import styles from './Styles/ProductsListScreenStyle'
import { Images, Colors } from './DevTheme'
import ProgressBar from '../Components/ProgressBar'
const dataprovider = new DataProvider()
let page = 0;
export default class ProductsListScreen extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: true,
      isRefreshing: false,
      currentPage: 0,
      list: []
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.getProductsNextPage = this.getProductsNextPage.bind(this)
  }
  static navigationOptions = {
    title: 'Products'
  };
  componentWillMount () {
    this.getProducts()
  }
  /**
   * create a new dataprovider instance and login using userename password
   */
  getProducts = (isRefreshed) => {
    dataprovider.getProducts(this.state.currentPage)
      .then((data) => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
        const dataSource = ds.cloneWithRows(data)
        this.setState({
          list: data,
          dataSource,
          isLoading: false
        })
        console.log(data)
      })
      .catch((err) => {
        this.setState({isLoading: false})
      })
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }
  getProductsNextPage () {
    page = page + 5
    dataprovider.getProducts(page)
      .then(res => {
        const data = this.state.list
        const newData = res
        newData.map((item, index) => data.push(item))
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data)
        })
      }).catch(err => {
      })
  }
  onRefresh () {
    this.setState({ isRefreshing: true })
    this.getProducts('isRefreshed')
  }
  render () {
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        {
          this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View>
            : <ListView
              style={styles.container}
              enableEmptySections
              onEndReached={type => this.getProductsNextPage()}
              onEndReachedThreshold={1200}
              dataSource={this.state.dataSource}
              renderRow={item => <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ProductDetailScreen', {
                  productDetail: item
                })
              }} style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeader}>{item.id} - {item.name}</Text>
                <Text style={styles.sectionText}>Code: {item.code.toString()}</Text>
                <Text style={styles.sectionText}>Description: {item.description.toString()}</Text>
                <View style={styles.sectionImage}>
                  {
                    item.image_small && <Image style={{ width: 100, height: 100}} source={{ uri: `data:image/png;base64,${item.image_small}`}} />
                  }
                </View>

              </TouchableOpacity>}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.onRefresh}
                  colors={['#EA0000']}
                  tintColor='white'
                  title='loading...'
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
