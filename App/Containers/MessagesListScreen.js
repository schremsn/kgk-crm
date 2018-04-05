import React, {Component} from 'react'
import { View, Alert, Text, Image, TouchableOpacity, RefreshControl, ListView } from 'react-native'
import DataProvider from '../Lib/dataprovider'
import styles from './Styles/ProductsListScreenStyle'
import { Images } from './DevTheme'
import ProgressBar from '../Components/ProgressBar'
const dataprovider = DataProvider.getInstance()
let page = 0
export default class MessagesListScreen extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: true,
      isRefreshing: false,
      currentPage: 0,
      messages: []
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.getProductsNextPage = this.getProductsNextPage.bind(this)
  }
  static navigationOptions = {
    title: 'Messages'
  };
  componentWillMount () {
    this.getMessages()
  }
  getMessages = (isRefreshed) => {
    dataprovider.getMessages(this.state.currentPage)
      .then((data) => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
        const dataSource = ds.cloneWithRows(data)
        this.setState({
          messages: data,
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
        const data = this.state.messages
        res.map((item, index) => data.push(item))
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data)
        })
      }).catch(err => {
        Alert.alert(
        'Get messages was error',
        err,
          [
          {text: 'Try', onPress: () => console.log('OK Pressed')}
          ],
        { cancelable: false }
      )
      })
  }
  onRefresh () {
    this.setState({ isRefreshing: true })
    this.getProducts('isRefreshed')
  }
  renderMessage = (item) => (
    <TouchableOpacity onPress={() => {
      this.props.navigation.navigate('ProductDetailScreen', {
        productDetail: item
      })
    }} style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>Date - {item.date}</Text>
      <Text style={styles.sectionText}>Email_from: {item.email_from}</Text>
      <Text style={styles.sectionText}>Author: {item.author_id ? item.author_id[1] : 'Anonymous'}</Text>
      <Text style={styles.sectionText}>Message: {item.body && item.body.substring(0, 40)}</Text>
    </TouchableOpacity>
  )
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
              renderRow={item => this.renderMessage(item)}
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
