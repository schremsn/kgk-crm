import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, ToastAndroid,
  Platform,
} from 'react-native';
import I18n from 'react-native-i18n';
import t from 'tcomb-form-native';
import Toast from 'react-native-easy-toast';
import { Images, Colors, Metrics } from './../Themes';
import styles, { stylesheet } from './Styles/ContainerStyles';
import Header from '../Components/Header';
import { updateLead } from '../Redux/LeadRedux';
import RoundedButton from '../Components/RoundedButton';


const { Form } = t.form;
const Person = t.struct({
  id: t.Number,
  name: t.maybe(t.String),
  contact_name: t.maybe(t.String),
  partner_name: t.maybe(t.String),
  phone: t.maybe(t.String),
  mobile: t.maybe(t.String),
  street2: t.maybe(t.String),
  city: t.maybe(t.String),
  zip: t.maybe(t.String),
  email_from: t.maybe(t.String),
  description: t.maybe(t.String),
  stage_id: t.maybe(t.Number),
});
const options = {
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
      label: I18n.t('Description'),
      stylesheet,
    },
    stage_id: {
      label: I18n.t('Stage'),
      stylesheet,
    },
  },
  i18n: {
    optional: ` ( ${I18n.t('optional')} )`,
    required: '',
  },
};

export default class LeadEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        city: props.navigation.state.params.leadDetail.city || '',
        contact_name: props.navigation.state.params.leadDetail.contact_name || '',
        description: props.navigation.state.params.leadDetail.description || '',
        email_from: props.navigation.state.params.leadDetail.email_from || '',
        id: props.navigation.state.params.leadDetail.id,
        mobile: props.navigation.state.params.leadDetail.mobile || '',
        name: props.navigation.state.params.leadDetail.name || '',
        partner_name: props.navigation.state.params.leadDetail.partner_name,
        phone: props.navigation.state.params.leadDetail.phone || '',
        stage_id: props.navigation.state.params.leadDetail.stage_id[0] || '',
        street: props.navigation.state.params.leadDetail.street || '',
        street2: props.navigation.state.params.leadDetail.street2 || '',
        zip: props.navigation.state.params.leadDetail.zip || '',
      },
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  onChange(value) {
    this.setState({ value });
  }
  onPress() {
    const value = this.form.getValue();
    if (value) {
      this.setState({ isLoading: true });
      updateLead(value)
        .then(() => {
          this.toast.show(I18n.t('Update lead is success'), 1000);
          setTimeout(() => {
            this.setState({ isLoading: false });
            this.props.navigation.replace('LeadDetailScreen', { leadId: value.id });
          }, 1000);
        })
        .catch(() => {
          this.toast.show(I18n.t('Update lead is error'), 1000);
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 1000);
        });
    }
  }
  render() {
    const { value, isLoading } = this.state;
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title={I18n.t('Edit Lead')} onPress={() => this.props.navigation.goBack(null)} />
        <Toast ref={(c) => { this.toast = c; }} />
        {
          isLoading &&
          <View style={[styles.progressBarLoading]}>
            <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
          </View>
        }
        <ScrollView style={[styles.mainContainer, {
          height: Metrics.screenHeight,
          marginBottom: 60,
        }]}
        >
          <KeyboardAvoidingView behavior="padding">
            <Form
              ref={(c) => { this.form = c; }}
              type={Person}
              options={options}
              value={value}
              onChange={this.onChange}
            />
            <RoundedButton onPress={this.onPress} text={I18n.t('Update')} />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

LeadEditScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

