import React, {Component} from 'react'
import { View, ScrollView, Text, Image } from 'react-native'
import I18n from 'react-native-i18n'

import styles from './Styles/ProductDetailScreen'
import { Images } from './../Themes'
import RoundedButton from '../../App/Components/RoundedButton'
import {getProductDetail} from "../Redux/ProductRedux";
import {connect} from "react-redux";

const data = [
  {name: 'id', value: 'Id'},
  {name: 'name', value: I18n.t('name')},
  {name: 'code', value: I18n.t('code')},
  {name: 'description', value: I18n.t('description')},
  {name: 'image_small', value: I18n.t('image')}]
export default class ProductDetailScreen extends Component {
  constructor () {
    super()
    this.state = {
      productDetail: []
    }
    this.renderCard = this.renderCard.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }
  static navigationOptions = {
    title: 'Product Detail'
  };
  componentWillMount () {
    const productId = this.props.navigation.state.params.productId
    this.props.getProductDetail(productId, (productDetail) =>{
      this.setState({productDetail})
    })
  }
  renderCard (cardTitle, rowData, isButton) {
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
    if (rowData !== null) {
      return (
        data.map(item => (<View key={item.name} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{item.value}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            {
              item.value === I18n.t('image')
                ? <Image source={{uri: `data:image/png;base64,${rowData[item.name]}`}} style={{ width: 100, height: 100, marginBottom: 10}} />
                : <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
            }
          </View>
        </View>))
      )
    } else {
      return (
        <View style={styles.sectionHeaderContainer}>
          <RoundedButton onPress={() => this.props.navigation.navigate('WebViewScreen')}>
            Detail
          </RoundedButton>
        </View>
      )
    }
  }
  render () {
    const { productDetail } = this.state
    console.log(productDetail)
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView>
          <View style={{padding: 10}}>
            {this.renderCard('Product Information', productDetail)}
          </View>
          <View style={{padding: 10}}>
            {this.renderCard('Traning Information', null, true)}
          </View>
        </ScrollView>
      </View>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    getProductDetail: (productId, cb) => { dispatch(getProductDetail(productId, cb)) },
  }
}

export default connect(null, mapDispatchToProps)(ProductDetailScreen)
