import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
// libraries
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import t from 'tcomb-form-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
// components
import BaseScreen from '../../Components/BaseScreen';
import Input from '../../Components/Form/Input';
import ProgressBar from '../../Components/ProgressBar';
import RoundedButton from '../../Components/RoundedButton';
// actions
import { createCustomer, getContactCategories } from './ContactsRedux';
// styles
import { Colors } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';


const { Form } = t.form;

class ContactsAddScreen extends Component {
  constructor() {
    super();
    this.state = {
      value: {
        is_company: false,
      },
      tags: [],
      selectedItems: [],
      isLoading: false,
    };
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
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
        zip: {
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
          label: `${I18n.t('Province')} ( ${I18n.t('required')} )`,
          stylesheet,
          mode: 'dropdown',
          itemStyle: {
            color: Colors.snow,
            backgroundColor: 'transparent',
          },
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
  componentDidMount() {
    this.getTypeForm();
    getContactCategories().then((tags) => { this.setState({ tags }); });
  }
  async getTypeForm() {
    const { states } = this.props;
    const setStateOption = () => {
      const stateOptions = {};
      const stateLength = states.length;
      for (let i = 0; i < stateLength; i += 1) {
        stateOptions[states[i].name] = states[i].name;
      }
      return stateOptions;
    };
    const type = t.struct({
      is_company: t.Boolean,
      name: t.String,
      identification_id: t.maybe(t.String),
      street: t.maybe(t.String),
      street2: t.maybe(t.String),
      city: t.maybe(t.String),
      state_id: t.enums(setStateOption(), 'state'),
      zip: t.maybe(t.Number),
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
  onSelectedItemsChange(selectedItems) {
    this.setState({ selectedItems });
  }
  onPress() {
    const { states } = this.props;
    if (this.form.getValue()) {
      const value = { ...this.form.getValue(), state_id: states.filter(item => item.name === this.form.getValue().state_id)[0].id, category_id: this.state.selectedItems };
      this.setState({ isLoading: true });
      createCustomer(value)
        .then(() => {
          this.setState({ isLoading: false });
          ToastAndroid.show(I18n.t('Create contacts is success'), ToastAndroid.SHORT);
          this.props.navigation.replace('ContactsListScreen');
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
  }
  render() {
    const {
      value, isLoading, type, tags,
    } = this.state;
    return (
      <BaseScreen title={I18n.t('Add Contact')} onPress={() => { this.props.navigation.goBack(null); }}>
        {isLoading && <ProgressBar isSubmitLoading />}
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
          <SectionedMultiSelect
            items={tags}
            uniqueKey="id"
            selectText={I18n.t('Choose tags')}
            confirmText={I18n.t('OK')}
            selectedText={I18n.t('selected')}
            searchPlaceholderText={I18n.t('Search tag')}
            styles={{
              selectToggleText: styles.selectToggleText,
              toggleIcon: styles.selectToggleText,
              chipText: styles.chipText,
              selectToggle: styles.selectToggle,
            }}
            showDropDowns
            showCancelButton
            onSelectedItemsChange={e => this.onSelectedItemsChange(e)}
            selectedItems={this.state.selectedItems}
            selectToggleIconComponent={
              <Ionicons
                size={20}
                name="ios-arrow-down-outline"
                style={{ color: 'white' }}
              />
            }
          />
          <RoundedButton onPress={this.onPress} text={I18n.t('Save')} />
        </KeyboardAwareScrollView>
      </BaseScreen>
    );
  }
}

ContactsAddScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  states: state.auth.states,
});

export default connect(mapStateToProps, null)(ContactsAddScreen);
