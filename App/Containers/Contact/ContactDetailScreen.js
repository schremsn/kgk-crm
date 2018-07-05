import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
// libraries
import * as Animatable from 'react-native-animatable';
import Communications from 'react-native-communications';
import Toast from 'react-native-easy-toast';
import I18n from 'react-native-i18n';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// components
import FullButton from '../../Components/FullButton';
import Header from '../../Components/Header';
import Input from '../../Components/Form/Input';
import ProgressBar from '../../Components/ProgressBar';
import RoundedButton from '../../Components/RoundedButton';
// actions
import { getContactCategories, getCustomerDetail, createContactAttachment } from '../../Redux/ContactsRedux';
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
      isModalUpFile: false,
      isLoading: false,
      items: [],
      fileName: '',
      file: {},
      description: '',
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.renderListActions = this.renderListActions.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.createAttachment = this.createAttachment.bind(this);
    this.upDocument = this.upDocument.bind(this);
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
  upDocument(event) {
    if (Platform.OS !== 'ios') {
      DocumentPicker.show({
        filetype: [DocumentPickerUtil.allFiles()],
      }, (error, file) => {
        if (file) {
          this.setState({ file, fileName: file.fileName });
        }
      });
    } else {
      const { pageX, pageY } = event.nativeEvent;
      DocumentPicker.show({
        top: pageY,
        left: pageX,
        filetype: [DocumentPickerUtil.allFiles()],
      }, (error, url) => {
        console.log(url);
      });
    }
  }
  createAttachment() {
    const {
      contactDetail, file, fileName, description,
    } = this.state;
    this.setState({ isLoading: true });
    RNFS.readFile(file.uri, 'base64')
      .then((dataBase64) => {
        createContactAttachment(contactDetail.id, dataBase64, fileName, description)
          .then(() => {
            this.setState({
 isModalUpFile: false, isLoading: false, fileName: '', description: '', file: {} 
});
            this.toast.show(I18n.t('Create attachment is success'), 1000);
          })
          .catch((e) => {
            this.setState({ isModalUpFile: false, isLoading: false });
            this.toast.show(I18n.t(e.message), 1000);
          });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        this.toast.show(I18n.t(err), 1000);
      });
  }
  renderModalUpFile() {
    const { contactDetail, fileName, isLoading } = this.state;
    return (
      <KeyboardAwareScrollView
        style={styles.boxAttachmentContent}
      >
        {isLoading && <ProgressBar isSubmitLoading />}

        <View style={styles.center}>
          <Text style={styles.labelForm}>{I18n.t('Upload document').toUpperCase()}</Text>
        </View>
        <Input
          baseInput
          label={I18n.t('Lead Id')}
          value={contactDetail.id ? contactDetail.id.toString() : ''}
          editable={false}
        />
        <View>
          <Text style={styles.labelForm}>{I18n.t('Document')}</Text>
          <Text style={styles.text}>{fileName}</Text>
          <View style={styles.center}>
            <RoundedButton
              onPress={e => this.upDocument(e)}
              text={I18n.t('Choose document')}
              styles={{ width: '49%', marginVertical: 20, backgroundColor: Colors.facebook }}
            />
          </View>
        </View>
        <Input
          baseInput
          label={I18n.t('description')}
          value={this.state.description}
          press={(description) => {
            this.setState({ description });
          }}
        />
        <View style={styles.boxButtons}>
          <RoundedButton
            onPress={() => this.setState({ isModalUpFile: false })}
            text={I18n.t('cancel')}
            styles={{ width: '49%', backgroundColor: Colors.frost }}
          />
          <RoundedButton
            onPress={this.createAttachment}
            text={I18n.t('Upload')}
            styles={{ width: '49%', backgroundColor: Colors.facebook }}
          />
        </View>
      </KeyboardAwareScrollView>
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
          <FullButton text={I18n.t('Upload document')} onPress={e => this.setState({ isModalUpFile: true })} />

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
    const {
      contactDetail, isShowActions, isRefreshing, isModalUpFile, isLoading,
    } = this.state;
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
        <Toast ref={(c) => { this.toast = c; }} />
        {
          isShowActions && this.renderListActions()
        }
        <Modal
          animationType="slide"
          transparent
          visible={isModalUpFile}
          onRequestClose={() => { this.setState({ isModalUpFile: false }); }}
        >
          {
            this.renderModalUpFile()
          }
        </Modal>
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
