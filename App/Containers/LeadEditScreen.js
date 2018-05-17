import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View, ActivityIndicator, Image,
  Platform, Text, TextInput,
} from 'react-native';
import I18n from 'react-native-i18n';
import t from 'tcomb-form-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';
import { Images, Colors } from './../Themes';
import styles, { stylesheet } from './Styles/ContainerStyles';
import Header from '../Components/Header';
import { updateLead } from '../Redux/LeadRedux';
import RoundedButton from '../Components/RoundedButton';
import ProgressBar from '../Components/ProgressBar';


const { Form } = t.form;

class LeadEditScreen extends Component {
  constructor(props) {
    super(props);
    const { leadDetail } = props.navigation.state.params;
    this.state = {
      value: {
        city: leadDetail.city ? leadDetail.city : '',
        contact_name: leadDetail.contact_name ? leadDetail.contact_name : '',
        description: leadDetail.description ? leadDetail.description : '',
        email_from: leadDetail.email_from ? leadDetail.email_from : '',
        id: leadDetail.id,
        mobile: leadDetail.mobile ? leadDetail.mobile : '',
        name: leadDetail.name ? leadDetail.name : '',
        partner_name: leadDetail.partner_name ? leadDetail.partner_name : '',
        external_status: leadDetail.external_status ? leadDetail.external_status : '',
        product: leadDetail.product ? leadDetail.product : '',
        phone: leadDetail.phone ? leadDetail.phone : '',
        stage_id: leadDetail.stage_id[0] ? parseInt(leadDetail.stage_id[0], 0) : '',
        street: leadDetail.street ? leadDetail.street : '',
        street2: leadDetail.street2 ? leadDetail.street2 : '',
        zip: leadDetail.zip ? leadDetail.zip : '',
      },
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.getTypeForm = this.getTypeForm.bind(this);
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.options = {
      hasError: true,
      fields: {
        id: {
          label: I18n.t('id'),
          stylesheet,
          editable: false,
        },
        name: {
          label: I18n.t('Lead name'),
          stylesheet,
        },
        contact_name: {
          label: I18n.t('Contact'),
          stylesheet,
        },
        partner_name: {
          label: I18n.t('Customer'),
          stylesheet,
          editable: false,
        },
        external_status: {
          label: I18n.t('Partner status'),
          stylesheet,
          editable: false,
        },
        product: {
          label: I18n.t('product'),
          stylesheet,
          editable: false,
        },
        phone: {
          label: I18n.t('Phone'),
          stylesheet,
        },
        mobile: {
          label: I18n.t('Mobile'),
          stylesheet,
        },
        street: {
          label: I18n.t('Street'),
          stylesheet,
        },
        street2: {
          label: I18n.t('Street2'),
          stylesheet,
        },
        city: {
          label: I18n.t('City'),
          stylesheet,
        },
        zip: {
          label: I18n.t('Zip'),
          stylesheet,
        },
        email_from: {
          label: I18n.t('Email'),
          stylesheet,
        },
        description: {
          template: this.templateInputNotes,
        },
        stage_id: {
          label: I18n.t('Stage'),
          stylesheet,
          mode: 'dropdown',
        },
      },
      i18n: {
        optional: ` ( ${I18n.t('optional')} )`,
        required: '',
      },
    };
  }
  componentWillMount() {
    this.getTypeForm();
  }
  async getTypeForm() {
    const { leadStages } = this.props;
    const stateOptions = {};
    const setStageOption = () => {
      for (let i = 0; i < leadStages.length; i += 1) {
        stateOptions[parseInt(leadStages[i].id, 0)] = leadStages[i].name;
      }
    };
    await setStageOption();
    const type = t.struct({
      id: t.Number,
      name: t.maybe(t.String),
      contact_name: t.maybe(t.String),
      partner_name: t.maybe(t.String),
      external_status: t.maybe(t.String),
      product: t.maybe(t.String),
      phone: t.maybe(t.String),
      mobile: t.maybe(t.String),
      street: t.maybe(t.String),
      street2: t.maybe(t.String),
      city: t.maybe(t.String),
      zip: t.maybe(t.String),
      email_from: t.maybe(t.String),
      description: t.maybe(t.String),
      stage_id: t.enums(stateOptions, 'dropdown'),
    });
    this.setState({ type });
  }
  onChange(value) {
    this.setState({ value });
  }
  onPress (){
    const value = { ...this.form.getValue(), stage_id: parseInt(this.form.getValue().stage_id, 0) };
    console.log(value);
    // if (value) {
    //   this.setState({ isLoading: true });
    //   updateLead(value)
    //     .then(() => {
    //       this.toast.show(I18n.t('Update lead is success'), 1000);
    //       setTimeout(() => {
    //         this.setState({ isLoading: false });
    //         this.props.navigation.replace('LeadDetailScreen', { leadId: value.id });
    //       }, 1000);
    //     })
    //     .catch(() => {
    //       this.toast.show(I18n.t('Update lead is error'), 1000);
    //       setTimeout(() => {
    //         this.setState({ isLoading: false });
    //       }, 1000);
    //     });
    // }
  }
  templateInputNotes() {
    const value = this.state.value.description ? this.state.value.description : '';
    return (
      <View >
        <Text style={styles.labelForm}>Notes</Text>
        <TextInput
          style={styles.inputFormMulti}
          value={value}
          multiline
          numberOfLines={3}
          onChangeText={(text) => {
            const valueNew = { ...this.state.value, description: text };
            this.setState({ value: valueNew });
          }}
        />
      </View>
    );
  }
  render() {
    const { value, isLoading, type } = this.state;
    return (
      <View style={[styles.containerHasForm]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('Edit Lead')} onPress={() => this.props.navigation.goBack(null)} />
        <Toast ref={(c) => { this.toast = c; }} />
        <KeyboardAwareScrollView
          style={{ marginBottom: 60 }}
          innerRef={(ref) => { this.scrollView = ref; }}
        >
          {
            type &&
            <Form
              ref={(c) => { this.form = c; }}
              type={type}
              options={this.options}
              value={value}
              onChange={this.onChange}
            />
          }
          <RoundedButton onPress={this.onPress} text={I18n.t('Update')} />
        </KeyboardAwareScrollView>
        {
          isLoading && <ProgressBar isSubmitLoading />
        }
      </View>
    );
  }
}

LeadEditScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  leadStages: state.lead.list,
});

export default connect(mapStateToProps, null)(LeadEditScreen);
