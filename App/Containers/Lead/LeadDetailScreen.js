import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, Image, TouchableOpacity, Alert, TouchableHighlight, TextInput, KeyboardAvoidingView, Picker } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Communications from 'react-native-communications';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-easy-toast';
import styles from '../Styles/ContainerStyles';
import { Images, Colors } from '../../Themes/index';
import { getLead, markLeadWon, markLeadLost, getLeadStatus, getLostReasons } from '../../Redux/LeadRedux';
import Header from '../../Components/Header';

import FullButton from '../../Components/FullButton';
import RoundedButton from '../../Components/RoundedButton';

const data = [
  { name: 'id', value: I18n.t('id') },
  { name: 'name', value: I18n.t('Lead name') },
  { name: 'contact_name', value: I18n.t('Contact') },
  { name: 'partner_name', value: I18n.t('Customer') },
  { name: 'external_status', value: I18n.t('Partner status') },
  { name: 'product', value: I18n.t('product') },
  { name: 'phone', value: I18n.t('Phone') },
  { name: 'mobile', value: I18n.t('Mobile') },
  { name: 'street', value: I18n.t('Street') },
  { name: 'street2', value: I18n.t('Street2') },
  { name: 'city', value: I18n.t('City') },
  { name: 'state_id', value: I18n.t('Province') },
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
    this.getLeadDetail();
  }
  componentDidMount() {
    if (!this.state.reasonLost.id) {
      this.props.getLostReasons();
    }
  }
  getLeadDetail() {
    const { leadId } = this.props.navigation.state.params;
    getLead(leadId)
      .then((leadDetail) => {
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
  getPartnerInformation() {
    getLeadStatus(this.state.leadDetail.id)
      .then((res) => {
        this.props.navigation.navigate('LeadCommissionStatusDetailScreen', { commissionDetail: res[0] });
      });
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
              this.renderField(item.name, rowData[item.name])
            }
          </View>

        </View>))
    );
  }
  renderField(name, value) {
    console.log(name, typeof (value) )
    switch (name) {
      case 'phone': return (
        <View style={styles.boxLeadPhone}>
          <Text style={styles.rowInfo}>{value}</Text>
          {
            value &&
            <TouchableOpacity
              style={styles.buttonCallPhone}
              onPress={() => this.onCallPhone(value)}
            >
              <Ionicons name="ios-call-outline" size={25} color={Colors.banner} />
            </TouchableOpacity>
          }
        </View>
      );
      case 'mobile': return (
        <View style={styles.boxLeadPhone}>
          <Text style={styles.rowInfo}>{value}</Text>
          {
            value &&
            <TouchableOpacity
              style={styles.buttonCallPhone}
              onPress={() => this.onCallPhone(value)}
            >
              <Ionicons name="ios-call-outline" size={25} color={Colors.banner} />
            </TouchableOpacity>
          }
        </View>
      );
      case 'external_status': return (
        <View style={styles.boxLeadPhone}>
          <Text style={styles.rowInfo}>{value}</Text>
          {
            value &&
            <TouchableOpacity
              style={styles.buttonCallPhone}
              onPress={() => this.getPartnerInformation()}
            >
              <Ionicons name="ios-information-circle-outline" size={25} color={Colors.banner} />
            </TouchableOpacity>
          }
        </View>
      );
      default: return (<Text style={styles.rowInfo}>{typeof (value) === 'object' ? value[1] : value} </Text>);
    }
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

          <FullButton text={I18n.t('New lead')} onPress={() => this.props.navigation.navigate('LeadAddScreen')} />
          <FullButton text={I18n.t('Edit')} onPress={() => this.props.navigation.navigate('LeadEditScreen', { leadDetail: this.state.leadDetail, reloadData: () => { this.getLeadDetail(); } })} />
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
          <FullButton
            text={I18n.t('Cancel')}
            onPress={() => this.setState({ isShowActions: false })}
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
            onValueChange={itemValue => this.setState({ reasonLost: itemValue })}
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
    const { leadDetail, isShowActions, isSelectLostReason } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header
          title={I18n.t('lead detail')}
          onPress={() => { this.props.navigation.goBack(null); }}
        />
        <ScrollView style={[styles.mainContainerModal]}>
          {leadDetail.id && this.renderCard('Lead Information', leadDetail)}
        </ScrollView>
        {
          isShowActions && this.renderListActions()
        }
        {
          isSelectLostReason && this.renderSelectLostReason()
        }
        {
          (!isShowActions) &&
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
  listReasonLost: PropTypes.array.isRequired,
  getLostReasons: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  listReasonLost: state.lead.listReasonLost,
});
const mapDispatchToProps = dispatch => ({
  getLostReasons: () => dispatch(getLostReasons()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetailScreen);
