import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
// libraries
import * as Animatable from 'react-native-animatable';
import Communications from 'react-native-communications';
import Toast from 'react-native-easy-toast';
import I18n from 'react-native-i18n';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
// components
import FullButton from '../../Components/FullButton';
import Header from '../../Components/Header';
// actions
import { getContactCategories, getCustomerDetail } from '../../Redux/ContactsRedux';
// styles
import { Colors, Images } from '../../Themes/index';
import styles from '../Styles/ContainerStyles';

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
  { name: 'state_id', value: I18n.t('Province') },
  { name: 'category_id', value: I18n.t('Tag') },
  { name: 'identification_id', value: I18n.t('identification id') },
];
class ContactDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactDetail: {},
      isShowActions: false,
      isRefreshing: false,
      items: [],
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.renderListActions = this.renderListActions.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentDidMount() {
    this.getContactDetail();
    getContactCategories().then((items) => { this.setState({ items }); });

  }
  getContactDetail(isRefreshed) {
    const { contactId } = this.props.navigation.state.params;
    getCustomerDetail(contactId)
      .then((result) => {
        this.setState({ contactDetail: result[0] });
      });
    if (isRefreshed) {
      this.setState({ isRefreshing: false });
    }
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
    return this.renderRows(rowData);
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
      case 'category_id': return (
        <View>
          <SectionedMultiSelect
            items={this.state.items}
            uniqueKey="id"
            hideSelect
            onSelectedItemsChange={e => console.log(e)}
            styles={{
              chipText: { color: Colors.charcoal, paddingRight: 10 },
              chipIcon: { display: 'none' },
            }}
            selectedItems={this.state.contactDetail.category_id}
          />
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
          <FullButton text={I18n.t('Add Contact')} onPress={() => this.props.navigation.navigate('ContactsAddScreen')} />
          <FullButton text={I18n.t('Edit')} onPress={() => this.props.navigation.navigate('ContactsEditScreen', { contactDetail: this.state.contactDetail, reloadData: () => { this.getContactDetail(); } })} />
          <FullButton
            text={I18n.t('Add Lead')}
            onPress={() => this.props.navigation.navigate('ContactsLeadAddScreen', { contactId: this.state.contactDetail.id, contactName: this.state.contactDetail.name })}
          />
          <FullButton
            text={I18n.t('Cancel')}
            onPress={() => this.setState({ isShowActions: false })}
          />
        </Animatable.View>
      </TouchableHighlight>
    );
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getContactDetail('isRefreshed');
  }
  render() {
    const { contactDetail, isShowActions, isRefreshing } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('Contact Detail')} onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView
          style={[styles.mainContainerModal]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
              colors={[Colors.fire]}
              tintColor={Colors.snow}
              title={`${I18n.t('loading')}...`}
              titleColor={Colors.snow}
              progressBackgroundColor={Colors.snow}
            />
          }
        >
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
