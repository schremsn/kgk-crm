import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, Image, TouchableOpacity, Alert, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Communications from 'react-native-communications';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-easy-toast';
import styles from '../Styles/ContainerStyles';
import { Images, Colors } from '../../Themes/index';
import { getCustomerDetail } from '../../Redux/ContactsRedux';
import Header from '../../Components/Header';
import FullButton from '../../Components/FullButton';

const data = [
  { name: 'id', value: I18n.t('id') },
  { name: 'name', value: I18n.t('name') },
  { name: 'city', value: I18n.t('City') },
  { name: 'mobile', value: I18n.t('mobile') },
  { name: 'phone', value: I18n.t('phone') },
  { name: 'email', value: I18n.t('Email') },
  { name: 'comment', value: I18n.t('notes') },
  { name: 'contact_address', value: I18n.t('Contact Address') },
  { name: 'is_company', value: I18n.t('Is Company') },
  { name: 'street', value: I18n.t('Street') },
  { name: 'street2', value: I18n.t('Street2') },
  { name: 'website', value: I18n.t('Website') },
  { name: 'zip', value: I18n.t('Zip') },
  { name: 'email_from', value: I18n.t('Email') },
  { name: 'state', value: I18n.t('Province') },
  { name: 'identification_id', value: I18n.t('identification id') },
];
class ContactDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactDetail: {},
      isShowActions: false,
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.renderListActions = this.renderListActions.bind(this);
  }
  componentWillMount() {
    const { contactId } = this.props.navigation.state.params;
    getCustomerDetail(contactId)
      .then((result) => {
        this.setState({ contactDetail: result[0] });
      });
  }
  onCallPhone(phone) {
    Alert.alert(
      I18n.t('Confirm'), `${I18n.t('Do you want to call')} ${phone} ?`,
      [
        {
          text: 'Cancel',
          onPress: () => true,
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            Communications.phonecall(phone, true);
          },
        },
      ],
    );
  }
  renderCard(cardTitle, rowData) {
    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        {this.renderRows(rowData)}
      </KeyboardAvoidingView>
    );
  }
  renderRows(rowData) {
    return (
      data.map(item => (
        <View key={item.name} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{item.value}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            {
              (item.name === 'phone' || item.name === 'mobile')
                ?
                  <View style={styles.boxLeadPhone}>
                    <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
                    {
                    rowData[item.name] &&
                    <TouchableOpacity
                      style={styles.buttonCallPhone}
                      onPress={() => this.onCallPhone(rowData[item.name])}
                    >
                      <Ionicons name="ios-call-outline" size={25} color={Colors.banner} />
                    </TouchableOpacity>
                  }
                  </View>
                : <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
            }
          </View>

        </View>))
    );
  }
  renderListActions() {
    return (
      <TouchableHighlight
        onPress={() => this.setState({ isShowActions: false })}
        activeOpacity={1}
        underlayColor="#5f3e63b0"
        style={styles.boxActions}
      >
        <Animatable.View
          animation="fadeInUpBig"
          iterationCount={1}
          duration={300}
          direction="normal"
          style={styles.boxActionContent}
        >
          <FullButton text={I18n.t('Add Contact')} onPress={() => this.props.navigation.navigate('ContactsAddScreen')} />
          <FullButton text={I18n.t('Edit')} onPress={() => this.props.navigation.navigate('ContactsEditScreen', { contactDetail: this.state.contactDetail })} />
          <FullButton
            text={I18n.t('Add Lead')}
            onPress={() => this.props.navigation.navigate('LeadAddScreen', { contactId: this.state.contactDetail.id, contactName: this.state.contactDetail.name })}
          />
          <FullButton
            text={I18n.t('Cancel')}
            onPress={() => this.setState({ isShowActions: false })}
          />
        </Animatable.View>
      </TouchableHighlight>
    );
  }
  render() {
    const { contactDetail, isShowActions } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('Contact Detail')} onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView style={[styles.mainContainer]}>
          {contactDetail.id && this.renderCard('Lead Information', contactDetail)}
        </ScrollView>
        {
          isShowActions && this.renderListActions()
        }
        {
          !isShowActions &&
          <TouchableOpacity
            style={[styles.buttonBox]}
            onPress={() => this.setState({ isShowActions: true })}
          >
            <View style={styles.button}>
              <Ionicons name="ios-more-outline" size={25} color={Colors.snow} />
            </View>
          </TouchableOpacity>
        }
        <Toast ref={(c) => { this.toast = c; }} />
      </View>
    );
  }
}

ContactDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};


export default connect(null, null)(ContactDetailScreen);
