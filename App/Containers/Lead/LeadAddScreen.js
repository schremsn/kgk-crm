import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// libraries
import I18n from 'react-native-i18n';
import t from 'tcomb-form-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
// components
import BaseScreen from '../../Components/BaseScreen';
import RoundedButton from '../../Components/RoundedButton';
import Input from '../../Components/Form/Input';
import ProgressBar from '../../Components/ProgressBar';
// actions
import { createLead, getLeadTags } from '../../Redux/LeadRedux';
// styles
import { Colors } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';

const { Form } = t.form;

class LeadAddScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        stage_id: '1',
        description: '',
        partner_id: this.props.navigation.state.params ? this.props.navigation.state.params.contactId : null,
      },
      customerName: this.props.navigation.state.params ? this.props.navigation.state.params.contactName : '',
      productName: '',
      isLoading: false,
      selectedItems: [],
      tags: [],
    };
    this.onChangeForm = this.onChangeForm.bind(this);
    this.onPress = this.onPress.bind(this);
    this.getTypeForm = this.getTypeForm.bind(this);
    this.templateInputCustomer = this.templateInputCustomer.bind(this);
    this.templateInputProduct = this.templateInputProduct.bind(this);
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.onSelectContact = this.onSelectContact.bind(this);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.options = {
      hasError: true,
      fields: {
        name: {
          label: I18n.t('Lead name'),
          stylesheet,
        },
        partner_id: {
          template: this.templateInputCustomer,
        },
        stage_id: {
          label: I18n.t('Stage'),
          stylesheet,
          mode: 'dropdown',
          itemStyle: {
            color: Colors.snow,
            backgroundColor: 'transparent',
          },
        },
        product: {
          template: this.templateInputProduct,
        },
        description: {
          template: this.templateInputNotes,
        },
      },
      i18n: {
        optional: ` ( ${I18n.t('optional')} )`,
        required: '',
      },
    };
  }
  componentDidMount() {
    this.getTypeForm();
    getLeadTags().then((tags) => {
      this.setState({
        tags,
      });
    });
  }
  async getTypeForm() {
    const { leadStages } = this.props;
    const setStageOption = () => {
      const stageOptions = {};
      for (let i = 0; i < leadStages.length; i += 1) {
        stageOptions[leadStages[i].id] = leadStages[i].name;
      }
      return stageOptions;
    };
    const type = t.struct({
      name: t.String,
      partner_id: t.Number,
      product: t.Number,
      stage_id: t.enums(setStageOption(), 'stage_id'),
      description: t.maybe(t.String),
    });
    this.setState({ type });
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }
  onChangeForm(value) {
    this.setState({ value });
  }
  onPress() {
    if (this.form.getValue()) {
      const value = { ...this.form.getValue(), stage_id: parseInt(this.form.getValue().stage_id, 0), tag_ids: this.state.selectedItems };
      this.setState({ isLoading: true });
      createLead(value)
        .then(() => {
          this.toast.show(I18n.t('Add lead is success'), 1000);
          setTimeout(() => {
            this.setState({ isLoading: false });
            this.props.navigation.goBack(null);
          }, 1000);
        })
        .catch(() => {
          this.toast.show(I18n.t('Add lead is error'), 1000);
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 1000);
        });
    }
  }
  onSelectContact(value) {
    this.setState({
      value: { ...this.state.value, partner_id: parseInt(value.id, 0) },
      customerName: value.name,
    });
    this.props.navigation.goBack(null);
  }
  onSelectProduct(value) {
    this.setState({
      value: { ...this.state.value, product: parseInt(value.id, 0) },
      productName: value.name,
    });
    this.props.navigation.goBack(null);
  }
  templateInputCustomer() {
    const value = this.state.customerName;
    return (
      <Input
        selectInput
        label={I18n.t('Customer')}
        value={value}
        press={() => {
        if (this.props.navigation.state.params && this.props.navigation.state.params.contactId) {
          this.props.navigation.navigate('ContactsListScreen', { onSelectContact: this.onSelectContact });
        } else {
          this.props.navigation.navigate('ContactListPipelineScreen', { onSelectContact: this.onSelectContact });
        }
      }}
      />
    );
  }
  templateInputProduct() {
    const value = this.state.productName;
    return (
      <Input
        selectInput
        label={I18n.t('product')}
        value={value}
        press={() => {
        if (this.props.navigation.state.params && this.props.navigation.state.params.contactId) {
          this.props.navigation.navigate('ProductsListScreen', { onSelectProduct: this.onSelectProduct });
        } else { this.props.navigation.navigate('ProductsListPipelineScreen', { onSelectProduct: this.onSelectProduct }); }
}}
      />
    );
  }
  templateInputNotes() {
    const value = this.state.value.description ? this.state.value.description : '';
    return (
      <Input
        multiline
        label={I18n.t('notes')}
        value={value}
        press={(text) => {
          const valueNew = { ...this.state.value, description: text };
          this.setState({ value: valueNew });
        }}
      />
    );
  }
  render() {
    const {
      value, isLoading, type, tags,
    } = this.state;
    return (
      <BaseScreen
        title={I18n.t('Add Lead')}
        onPress={() => { this.props.navigation.goBack(null); }}
      >
        {isLoading && <ProgressBar isSubmitLoading />}
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
              onChange={this.onChangeForm}
            />
          }

          <SectionedMultiSelect
            ref={(node) => { this.sectionedMultiSelect = node; }}
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

LeadAddScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  leadStages: state.lead.list,
});

export default connect(mapStateToProps, null)(LeadAddScreen);
