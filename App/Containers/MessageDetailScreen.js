import React, {Component} from 'react'
import { View, ScrollView, Text, Image, WebView, Platform, Dimensions } from 'react-native'
import I18n from 'react-native-i18n'
import {connect} from "react-redux";
import styles from './Styles/ProductDetailScreen'
import { Images } from './../Themes'
import RoundedButton from '../../App/Components/RoundedButton'
import WebViewAutoHeight from '../../App/Components/WebViewAutoHeight'
import {getProductDetail} from "../Redux/ProductRedux";

const data = [
  {name: 'id', value: 'Id'},
  {name: 'date', value: I18n.t('date')},
  {name: 'email_from', value: I18n.t('email from')},
  {name: 'name', value: I18n.t('name')}
  ]
export default class MessageDetailScreen extends Component {
  constructor () {
    super()
    this.state = {
      messageDetail: []
    }
    this.renderCard = this.renderCard.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }
  static navigationOptions = {
    title: 'Message Detail'
  };
  componentWillMount () {
    const messageDetail = this.props.navigation.state.params.messageDetail
    this.setState({messageDetail})
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
    const { messageDetail } = this.state
    console.log(messageDetail)
    return (
      <View style={[styles.container, styles.mainContainer]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView>
          <View style={{padding: 10}}>
            {this.renderCard('Message Information', messageDetail)}
          </View>
          <View style={{padding: 20}}>
            <WebViewAutoHeight
              source={{ html: `<body>${messageDetail.body}</body>` }}
            />
          </View>


          {/*<View style={{padding: 10}}>*/}
            {/*{this.renderCard('Traning Information', null, true)}*/}
          {/*</View>*/}

        </ScrollView>
      </View>
    )
  }
}


