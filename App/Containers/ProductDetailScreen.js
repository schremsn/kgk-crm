import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import styles from './Styles/ProductDetailScreen'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'

const data = [
  {name: 'id', value: 'Id'},
  {name: 'name', value: 'Name'},
  {name: 'code', value: 'Code'},
  {name: 'description', value: 'Description'},
  {name: 'image_small', value: 'Image'}]
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
    this.setState({
      productDetail: this.props.navigation.state.params.productDetail
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
              item.value === 'image_small'
                ? <Image source={{ uri: `data:image/png;base64,${item.image_small}`}} style={[styles.logo, { width: 100, height: 100, marginBottom: 10}]} />
                : <Text style={styles.rowInfo}>{rowData[item.name].toString()}</Text>
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
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <View style={{padding: 10}}>
          {this.renderCard('Product Information', productDetail)}
        </View>
        <View style={{padding: 10}}>
          {this.renderCard('Traning Information', null, true)}
        </View>
      </View>
    )
  }
}
