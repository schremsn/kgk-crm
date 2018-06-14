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
import { updateCustomer } from '../../Redux/ContactsRedux';
import RoundedButton from '../../Components/RoundedButton';
import Input from '../../Components/Form/Input';


const { Form } = t.form;

class ContactsEditScreen extends Component {
  constructor(props) {
    super(props);
    const { contactDetail } = props.navigation.state.params;
    this.state = {
      value: {
        is_company: contactDetail.is_company,
        id: contactDetail.id ? contactDetail.id : null,
        name: contactDetail.name ? contactDetail.name : null,
        identification_id: contactDetail.identification_id ? contactDetail.identification_id : null,
        street: contactDetail.street ? contactDetail.street : null,
        street2: contactDetail.street2 ? contactDetail.street2 : null,
        city: contactDetail.city ? contactDetail.city : null,
        state_id: contactDetail.state_id[0] ? contactDetail.state_id[0] : null,
        code_zip: contactDetail.code_zip ? contactDetail.code_zip : null,
        phone: contactDetail.phone ? contactDetail.phone : null,
        mobile: contactDetail.mobile ? contactDetail.mobile : null,
        website: contactDetail.website ? contactDetail.website : null,
        email: contactDetail.email ? contactDetail.email : null,
        comment: contactDetail.comment ? contactDetail.comment : null,
      },
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.options = {
      hasError: true,
      fields: {
        id: {
          label: `${I18n.t('id')}`,
          stylesheet,
          editable: false,
        },
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
        state_id: {
          label: I18n.t('Province'),
          stylesheet,
          mode: 'dropdown',
        },
        comment: {
          template: this.templateInputNotes,
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
      id: t.Number,
      is_company: t.Boolean,
      name: t.String,
      identification_id: t.maybe(t.String),
      street: t.maybe(t.String),
      street2: t.maybe(t.String),
      city: t.maybe(t.String),
      state_id: t.enums(setStateOption(), 'state'),
      code_zip: t.maybe(t.Number),
      phone: t.maybe(t.Number),
      mobile: t.maybe(t.Number),
      website: t.maybe(t.String),
      email: t.maybe(t.String),
      comment: t.maybe(t.String),
    });
    this.setState({ type });
  }
  templateInputNotes() {
    const value = this.state.value.comment ? this.state.value.comment : '';
    return (
      <Input
        multiline
        label={I18n.t('notes')}
        value={value}
        press={(text) => {
          const valueNew = { ...this.state.value, comment: text };
          this.setState({ value: valueNew });
        }}
      />
    );
  }
  onChange(value) {
    this.setState({ value });
  }
  onPress() {
    if (this.form.getValue()) {
      const value = { ...this.form.getValue(), state: parseInt(this.form.getValue().state_id, 0) };
      console.log(value)
      this.setState({ isLoading: true });
      updateCustomer(value)
        .then(() => {
          this.setState({ isLoading: false });
          ToastAndroid.show(I18n.t('Update contacts is success'), ToastAndroid.SHORT);
          this.props.navigation.goBack(null);
          this.props.navigation.state.params.reloadData();
        })
        .catch(() => {
          this.setState({ isLoading: false });
          ToastAndroid.show(I18n.t('Update contacts is error'), ToastAndroid.SHORT);
        });
    }
  }
  render() {
    const { value, isLoading, type } = this.state;
    return (
      <View style={[styles.containerHasForm]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header
          title={I18n.t('Edit Contact')}
          onPress={() => { this.props.navigation.goBack(null); }}
        />
        {
          isLoading &&
          <View style={[styles.progressBarLoading]}>
            <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
          </View>
        }
        <KeyboardAwareScrollView
          style={{ marginBottom: 70 }}
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
          <RoundedButton onPress={this.onPress} text={I18n.t('Save')} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

ContactsEditScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
};


const mapStateToProps = state => ({
  states: state.auth.states,
});

export default connect(mapStateToProps, null)(ContactsEditScreen);
