import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {View, ScrollView, Text, Image, TouchableOpacity, BackHandler, Alert, TouchableHighlight} from 'react-native'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import styles from './Styles/ContainerStyles'
import { Images, Metrics } from './../Themes'
import { getLead } from '../Redux/LeadRedux'
import Header from '../Components/Header'
import {Colors} from '../Themes'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Communications from 'react-native-communications'
import FullButton from '../Components/FullButton';
import * as Animatable from 'react-native-animatable';

const data = [
  { name: 'id', value: I18n.t('id') },
  { name: 'name', value: I18n.t('Lead name') },
  { name: 'contact_name', value: I18n.t('Contact') },
  { name: 'partner_name', value: I18n.t('Customer') },
  { name: 'phone', value: I18n.t('Phone') },
  { name: 'mobile', value: I18n.t('Mobile') },
  { name: 'street', value: I18n.t('Street') },
  { name: 'street2', value: I18n.t('Street2') },
  { name: 'city', value: I18n.t('City') },
  { name: 'zip', value: I18n.t('Zip') },
  { name: 'email_from', value: I18n.t('Email') },
  { name: 'description', value: I18n.t('Description') },
  { name: 'stage_id', value: I18n.t('Stage') }
]
class LeadDetailScreen extends Component {
  constructor () {
    super()
    this.state = {
      leadDetail: [],
      isShowActions: false
    }
    this.renderCard = this.renderCard.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }
  componentWillMount () {
    const { leadId } = this.props.navigation.state.params
    this.props.getLeadById(leadId, (leadDetail) => {
      this.setState({ leadDetail })
    })
  }
  renderCard (cardTitle, rowData) {
    return (
      <View style={{paddingBottom: 100}}>
        {this.renderRows(rowData)}
      </View>
    )
  }
  handleCallPhone (phone) {
    Alert.alert(
      I18n.t('Confirm'),
      `${I18n.t('Do you want to call')} ${phone} ?`,
      [
        {
          text: 'Cancel',
          onPress: () => true,
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            Communications.phonecall(phone, true)
          }
        }
      ]
    )
  }
  renderRows (rowData) {
    return (
      data.map(item => (
        <View key={item.name} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{item.value}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            {
              item.name === 'stage_id'
              ? <Text style={styles.rowInfo}>{rowData.stage_id[0]}</Text>
              : (item.name === 'phone' || item.name === 'mobile')
                ? <View style={styles.boxLeadPhone}>
                  <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
                  {
                    rowData[item.name] && <TouchableOpacity style={styles.buttonCallPhone} onPress={() => this.handleCallPhone(rowData[item.name])}>
                      <Ionicons name='ios-call-outline' size={25} color={Colors.banner} />
                    </TouchableOpacity>
                  }
                </View>
                : <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
            }
          </View>
        </View>))
    )
  }
  render () {
    const { leadDetail, isShowActions } = this.state
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <Header title='lead detail' onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView style={[styles.mainContainer]}>
          {leadDetail[0] && this.renderCard('Lead Information', leadDetail[0])}
        </ScrollView>
        {
          isShowActions
            ? <TouchableHighlight
              onPress={() => this.setState({isShowActions: false})}
              activeOpacity={1}
              underlayColor={'#5f3e63b0'}
              style={styles.boxActions}>
              <Animatable.View
                animation={'fadeInUpBig'}
                iterationCount={1}
                duration={300}
                direction="normal"
                style={styles.boxActionContent}
              >
                <FullButton text={I18n.t('New lead')} />
                <FullButton text={I18n.t('Add note')} />
                <FullButton text={I18n.t('Log activity')} />
                <FullButton text={I18n.t('Mark won')} />
                <FullButton text={I18n.t('Mark lost')} />
                <FullButton text={I18n.t('Save')} />
                <FullButton text={I18n.t('Cancel')} onPress={() => this.setState({isShowActions: false})} />
              </Animatable.View>
          </TouchableHighlight>
            : <TouchableOpacity style={[styles.buttonBox]} onPress={() => this.setState({isShowActions: true})}>
              <View style={styles.button}>
                <Ionicons name="ios-more-outline" size={25} color={Colors.snow} />
              </View>
            </TouchableOpacity>
        }
      </View>
    )
  }
}

LeadDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getLeadById: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  getLeadById: (leadId, cb) => { dispatch(getLead(leadId, cb)) }
})

export default connect(null, mapDispatchToProps)(LeadDetailScreen)
