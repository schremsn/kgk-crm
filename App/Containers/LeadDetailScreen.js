import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, Image, TouchableOpacity, Alert, TouchableHighlight, TextInput, KeyboardAvoidingView, Picker } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Communications from 'react-native-communications';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-easy-toast';
import styles from './Styles/ContainerStyles';
import { Images, Metrics, Colors } from './../Themes';
import { getLead, markLeadWon, markLeadLost } from '../Redux/LeadRedux';
import Header from '../Components/Header';

import FullButton from '../Components/FullButton';
import RoundedButton from '../Components/RoundedButton';

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
  { name: 'stage_id', value: I18n.t('Stage') },
];
class LeadDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leadDetail: {},
      isShowActions: false,
      isEdit: false,
      isSelectLostReason: false,
      reasonLost: props.listReasonLost[0],
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.renderListActions = this.renderListActions.bind(this);
    this.renderSelectLostReason = this.renderSelectLostReason.bind(this);
    this.onMarkLeadWon = this.onMarkLeadWon.bind(this);
    this.onMarkLeadLost = this.onMarkLeadLost.bind(this);
  }
  componentWillMount() {
    const { leadId } = this.props.navigation.state.params;
    this.props.getLeadById(leadId, (leadDetail) => {
      this.setState({ leadDetail: leadDetail[0] });
    });
  }
  onCallPhone(phone) {
    Alert.alert(
      I18n.t('Confirm'),
      `${I18n.t('Do you want to call')} ${phone} ?`,
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
  onMarkLeadWon(lead) {
    markLeadWon(lead)
      .then(() => {
        this.toast.show(I18n.t('Mark lead won is success'), 1000);
        this.setState({ isShowActions: false });
      });
  }
  onMarkLeadLost() {
    const lead = {
      id: parseInt(this.state.leadDetail.id, 0),
      lost_reason: this.state.reasonLost.id,
    };
    markLeadLost(lead)
      .then(() => {
        this.toast.show(I18n.t('Mark lead lost is success'), 1000);
        this.setState({ isSelectLostReason: false, isShowActions: false });
      });
  }
  renderCard(cardTitle, rowData) {
    return (
      <KeyboardAvoidingView behavior="padding" enabled>
        {this.renderRows(rowData)}
        {
          this.state.isEdit &&
          <View style={styles.boxButtons}>
            <RoundedButton
              onPress={() => this.setState({ isEdit: false })}
              text={I18n.t('Cancel')}
              styles={{ width: '49%', backgroundColor: Colors.frost }}
            />
            <RoundedButton onPress={this.onPress} text={I18n.t('Save')} styles={{ width: '49%' }} />
          </View>
        }
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
              item.name === 'stage_id'
                ? <Text style={styles.rowInfo}>{rowData.stage_id[1]}</Text>
                : (item.name === 'phone' || item.name === 'mobile')
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

          <FullButton text={I18n.t('New lead')} />
          <FullButton text={I18n.t('Edit')} onPress={() => this.props.navigation.navigate('LeadEditScreen', { leadDetail: this.state.leadDetail })} />
          <FullButton
            text={I18n.t('Log activity')}
            disable
            styles={{ backgroundColor: Colors.steel }}
          />
          <FullButton
            text={I18n.t('Mark won')}
            onPress={() => this.onMarkLeadWon({ id: this.state.leadDetail.id })}
          />
          <FullButton
            text={I18n.t('Mark lost')}
            onPress={() => this.setState({ isSelectLostReason: true })}
          />

        </Animatable.View>

      </TouchableHighlight>
    );
  }
  renderSelectLostReason() {
    return (
      <View
        style={styles.boxPicker}
      >
        <View style={styles.boxPickerContent}>
          <TextInput>The Lost Reason </TextInput>
          <Picker
            selectedValue={this.state.reasonLost}
            style={{ height: 50, width: '100%' }}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => this.setState({ reasonLost: itemValue })}
          >
            {
              this.props.listReasonLost.map(item => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))
            }
          </Picker>
          <View style={styles.boxButtons}>
            <RoundedButton
              onPress={() => this.setState({ isSelectLostReason: false })}
              text={I18n.t('Cancel')}
              styles={{ width: '49%', backgroundColor: Colors.frost }}
            />
            <RoundedButton onPress={() => this.onMarkLeadLost()} text={I18n.t('OK')} styles={{ width: '49%' }} />
          </View>
        </View>
      </View>
    );
  }
  render() {
    const {
      leadDetail, isShowActions, isEdit, isSelectLostReason,
    } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('lead detail')} onPress={() => this.props.navigation.navigate('LeadListScreen', { stageId: leadDetail.stage_id[0], stageName: leadDetail.stage_id[1] })} />

        <ScrollView style={[styles.mainContainer]}>
          {leadDetail.id && this.renderCard('Lead Information', leadDetail)}
        </ScrollView>
        {
          isShowActions && this.renderListActions()
        }
        {
          isSelectLostReason && this.renderSelectLostReason()
        }
        {
          (!isShowActions || !isEdit) &&
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

LeadDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getLeadById: PropTypes.func.isRequired,
  listReasonLost: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  listReasonLost: state.lead.listReasonLost,
});
const mapDispatchToProps = dispatch => ({
  getLeadById: (leadId, cb) => { dispatch(getLead(leadId, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetailScreen);
