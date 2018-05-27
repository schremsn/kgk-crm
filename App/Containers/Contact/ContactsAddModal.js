import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, Image, ToastAndroid, Platform } from 'react-native';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import t from 'tcomb-form-native';
import { Images, Colors } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';
import Header from '../../Components/Header';
import { createCustomer } from '../../Redux/ContactsRedux';
import RoundedButton from '../../Components/RoundedButton';


const { Form } = t.form;


class ContactsAddModal extends Component {
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
  componentWillMount() {
    this.getTypeForm();
  }
  async getTypeForm() {
    const { states } = this.props;
    const setStateOption = () => {
      const stateOptions = {};
      const stateLength = states.length;
      for (let i = 0; i < stateLength; i += 1) {
        stateOptions[states[i].id] = states[i].name;
      }
      return stateOptions;
    };
    const type = t.struct({
      is_company: t.Boolean,
      name: t.String,
      identification_id: t.maybe(t.String),
      street: t.maybe(t.String),
      street2: t.maybe(t.String),
      city: t.enums(setStateOption(), 'city'),
      state: t.maybe(t.String),
      code_zip: t.maybe(t.Number),
      phone: t.maybe(t.Number),
      mobile: t.maybe(t.Number),
      website: t.maybe(t.String),
      email: t.maybe(t.String),
      comment: t.maybe(t.String),
    });
    this.setState({ type });
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
          this.props.onShowAddContactModal(false);
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
  }
  render() {
    const { value, isLoading, type } = this.state;
    return (
      <View style={[styles.containerModal, { paddingVertical: 20 }]}>
        <Header
          title={I18n.t('Add Contact')}
          onPress={() => { this.props.onShowAddContactModal(false); }}
        />
        <KeyboardAwareScrollView
          style={styles.mainContainerHasFormModal}
          innerRef={(ref) => { this.scrollView = ref; }}
        >
          {
            type && <Form
              ref={(c) => { this.form = c; }}
              type={type}
              options={this.options}
              value={value}
              onChange={this.onChange}
            />
          }

          <RoundedButton onPress={this.onPress} styles={{ marginBottom: 20 }} text={I18n.t('Save')} />
        </KeyboardAwareScrollView>
        {
          isLoading &&
          <View style={[styles.progressBarLoading]}>
            <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
          </View>
        }
      </View>
    );
  }
}

ContactsAddModal.propTypes = {
  navigation: PropTypes.object.isRequired,
  onShowAddContactModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  states: state.auth.states,
});

export default connect(mapStateToProps, null)(ContactsAddModal);
