import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// libraries
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import t from 'tcomb-form-native';
import Toast from 'react-native-easy-toast';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
// components
import RoundedButton from '../../Components/RoundedButton';
import Input from '../../Components/Form/Input';
import BaseScreen from '../../Components/BaseScreen';
import ProgressBar from '../../Components/ProgressBar';
// actions
import { updateCustomer, getContactCategories } from './ContactsRedux';
// styles
import { Colors } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';

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
      tags: [],
      selectedItems: contactDetail.category_id || [],
      isLoading: false,
    };
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
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
  onSelectedItemsChange(selectedItems) {
    this.setState({ selectedItems });
  }
  onChange(value) {
    this.setState({ value });
  }
  onPress() {
    if (this.form.getValue()) {
      const value = { ...this.form.getValue(), state_id: parseInt(this.form.getValue().state_id, 0), category_id: this.state.selectedItems };
      this.setState({ isLoading: true });
      updateCustomer(value)
        .then(() => {
          this.setState({ isLoading: false });
          this.toast.show(I18n.t('Update contacts is success'), 1000);
          this.props.navigation.goBack(null);
          this.props.navigation.state.params.reloadData();
        })
        .catch((e) => {
          console.log(e)
          this.setState({ isLoading: false });
          this.toast.show(I18n.t('Update contacts is error'), 1000);
        });
    }
  }
  render() {
    const { value, isLoading, type, tags, selectedItems } = this.state;
    return (
      <BaseScreen title={I18n.t('Edit Contact')} onPress={() => { this.props.navigation.goBack(null); }}>
        {isLoading && <ProgressBar isSubmitLoading />}
        <Toast ref={(c) => { this.toast = c; }} />
        <KeyboardAwareScrollView style={{ marginBottom: 70 }} innerRef={(ref) => { this.scrollView = ref; }}>
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
            selectedItems={selectedItems}
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

ContactsEditScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  states: state.auth.states,
});

export default connect(mapStateToProps, null)(ContactsEditScreen);
