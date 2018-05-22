import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, ActivityIndicator, Image, ToastAndroid,
  Platform,
} from 'react-native';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import t from 'tcomb-form-native';
import { Images, Colors } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';
import Header from '../../Components/Header';
import { createCustomer } from '../../Redux/ContactsRedux';
import RoundedButton from '../../Components/RoundedButton';


const { Form } = t.form;

const Person = t.struct({
  is_company: t.Boolean,
  name: t.String,
  identification_id: t.maybe(t.String),
  street: t.maybe(t.String),
  street2: t.maybe(t.String),
  city: t.String,
  state: t.maybe(t.String),
  code_zip: t.maybe(t.Number),
  phone: t.maybe(t.Number),
  mobile: t.maybe(t.Number),
  website: t.maybe(t.String),
  email: t.maybe(t.String),
  comment: t.maybe(t.String),
});

export default class ContactsAddScreen extends Component {
  constructor() {
    super();
    this.state = {
      value: {
        is_company: true,
      },
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.options = {
      hasError: true,
      fields: {
        is_company: {
          label: `${I18n.t('Is Company')} ( ${I18n.t('required')} )`,
          stylesheet,
        },
        name: {
          label: `${I18n.t('name')} ( ${I18n.t('required')} )`,
          stylesheet,
        },
        identification_id: {
          label: I18n.t('identification id'),
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
          label: `${I18n.t('city')} ( ${I18n.t('required')} )`,
          stylesheet,
        },
        code_zip: {
          label: I18n.t('Zip'),
          stylesheet,
        },
        phone: {
          label: I18n.t('phone'),
          stylesheet,
        },
        mobile: {
          label: I18n.t('mobile'),
          stylesheet,
        },
        website: {
          label: I18n.t('Website'),
          stylesheet,
        },
        state: {
          label: I18n.t('Province'),
          stylesheet,
        },
        comment: {
          label: I18n.t('notes'),
          stylesheet,
        },
        email: {
          label: I18n.t('Email'),
          error: 'Email is Not Correct',
          stylesheet,
        },
      },
      i18n: {
        optional: ` ( ${I18n.t('optional')} )`,
        required: '',
      },
      // auto: 'placeholders'
    };
  }

  onChange(value) {
    this.setState({ value });
  }
  onPress() {
    const value = this.form.getValue();
    if (value) {
      this.setState({ isLoading: true });
      createCustomer(value)
        .then(() => {
          this.setState({ isLoading: false });
          ToastAndroid.show(I18n.t('Create contacts is success'), ToastAndroid.SHORT);
          if (this.props.isModal) {
            this.props.onShowAddContactModal(false);
          } else {
            this.props.navigation.replace('ContactsListScreen');
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
  }
  render() {
    const { value, isLoading } = this.state;
    return (
      <View style={[styles.containerHasForm]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header
          title={I18n.t('Add Contact')}
          onPress={() => {
          if (this.props.isModal) {
            this.props.onShowAddContactModal(false);
          } else {
            this.props.navigation.goBack(null);
          }
        }}
        />
        {
          isLoading &&
          <View style={[styles.progressBarLoading]}>
            <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
          </View>
        }
        <KeyboardAwareScrollView
          style={{ marginBottom: this.props.isModal ? 120 : 70 }}
          innerRef={(ref) => { this.scrollView = ref; }}
        >
          <Form
            ref={(c) => { this.form = c; }}
            type={Person}
            options={this.options}
            value={value}
            onChange={this.onChange}
          />
          <RoundedButton onPress={this.onPress} text={I18n.t('Save')} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

ContactsAddScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  isModal: PropTypes.bool,
  onShowAddContactModal: PropTypes.func,
};

