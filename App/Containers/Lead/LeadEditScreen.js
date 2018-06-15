import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
// libraries
import t from 'tcomb-form-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';
// components
import RoundedButton from '../../Components/RoundedButton';
import BaseScreen from '../../Components/BaseScreen'
import ProgressBar from '../../Components/ProgressBar';
import Input from '../../Components/Form/Input';
// actions
import { updateLead } from '../../Redux/LeadRedux';
// styles
import { Colors } from '../../Themes'
import { stylesheet } from '../Styles/ContainerStyles';

const { Form } = t.form;

class LeadEditScreen extends Component {
  constructor(props) {
    super(props);
    const { leadDetail } = props.navigation.state.params;
    this.state = {
      value: {
        city: leadDetail.city ? leadDetail.city : null,
        contact_name: leadDetail.contact_name ? leadDetail.contact_name : null,
        description: leadDetail.description ? leadDetail.description : null,
        email_from: leadDetail.email_from ? leadDetail.email_from : null,
        id: leadDetail.id,
        mobile: leadDetail.mobile ? leadDetail.mobile : null,
        name: leadDetail.name ? leadDetail.name : null,
        partner_name: leadDetail.partner_name ? leadDetail.partner_name : null,
        external_status: leadDetail.external_status ? leadDetail.external_status : null,
        product: leadDetail.product[0] ? parseInt(leadDetail.product[0], 0) : null,
        phone: leadDetail.phone ? leadDetail.phone : null,
        stage_id: leadDetail.stage_id[0] ? parseInt(leadDetail.stage_id[0], 0) : null,
        state_id: leadDetail.state_id[0] ? parseInt(leadDetail.state_id[0], 0) : null,
        street: leadDetail.street ? leadDetail.street : null,
        street2: leadDetail.street2 ? leadDetail.street2 : null,
        zip: leadDetail.zip ? leadDetail.zip : null,
      },
      isLoading: false,
      productName: leadDetail.product[1] ? leadDetail.product[1] : null,
    };
    this.onChange = this.onChange.bind(this);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.onPress = this.onPress.bind(this);
    this.getTypeForm = this.getTypeForm.bind(this);
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.templateInputProduct = this.templateInputProduct.bind(this);
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
          template: this.templateInputProduct,
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
        state_id: {
          label: I18n.t('Province'),
          stylesheet,
          mode: 'dropdown',
          itemStyle: {
            color: Colors.snow,
            backgroundColor: 'transparent'
          },
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
          itemStyle: {
            color: Colors.snow,
            backgroundColor: 'transparent'
          },
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
    const { leadStages, states } = this.props;
    const setStageOption = () => {
      const stageOptions = {};
      for (let i = 0; i < leadStages.length; i += 1) {
        stageOptions[leadStages[i].id] = leadStages[i].name;
      }
      return stageOptions;
    };
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
      name: t.maybe(t.String),
      contact_name: t.maybe(t.String),
      partner_name: t.maybe(t.String),
      external_status: t.maybe(t.String),
      product: t.maybe(t.Number),
      phone: t.maybe(t.String),
      mobile: t.maybe(t.String),
      street: t.maybe(t.String),
      street2: t.maybe(t.String),
      city: t.String,
      state_id: t.enums(setStateOption(), 'province'),
      zip: t.maybe(t.String),
      email_from: t.maybe(t.String),
      description: t.maybe(t.String),
      stage_id: t.enums(setStageOption(), 'stage_id'),
    });
    this.setState({ type });
  }
  onChange(value) {
    this.setState({ value });
  }
  onSelectProduct(value) {
    this.setState({
      value: { ...this.state.value, product: parseInt(value.id, 0) },
      productName: value.name,
    });
    this.props.navigation.goBack(null);
  }
  onPress() {
    if (this.form.getValue()) {
      const value = { ...this.form.getValue(), stage_id: parseInt(this.form.getValue().stage_id, 0), state: parseInt(this.form.getValue().state_id, 0) };
      this.setState({ isLoading: true });
      updateLead(value)
        .then(() => {
          this.setState({ isLoading: false });
          this.props.navigation.goBack(null);
          this.props.navigation.state.params.reloadData();
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
    }
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
  templateInputProduct() {
    const value = this.state.productName;
    return (
      <Input label={I18n.t('product')} value={value} press={() => { this.props.navigation.navigate('ProductsListPipelineScreen', { onSelectProduct: this.onSelectProduct });}} />
    );
  }
  render() {
    const { value, isLoading, type } = this.state;
    return (
      <BaseScreen
        title={I18n.t('Edit Lead')}
        onPress={() => { this.props.navigation.goBack(null) }}
      >
        {isLoading && <ProgressBar isSubmitLoading />}
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
      </BaseScreen>
    );
  }
}

LeadEditScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  leadStages: state.lead.list,
  states: state.auth.states,
});

export default connect(mapStateToProps, null)(LeadEditScreen);
