import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNative, {
  View, ActivityIndicator, Image, TouchableHighlight,
  Platform, Text, TextInput, Modal, TouchableOpacity,
} from 'react-native';
import I18n from 'react-native-i18n';
import t from 'tcomb-form-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';
import { Images, Colors, Metrics } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';
import ContactsAddScreen from '../Contact/ContactsAddScreen';
import ContactsListScreen from '../Contact/ContactsListScreen';
import ProductsListScreen from '../Product/ProductsListScreen';
import Header from '../../Components/Header';
import RoundedButton from '../../Components/RoundedButton';
import { createLead, getProducts } from '../../Redux/LeadRedux';

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
      isModalSearchContact: false,
      isModalAddContact: false,
      isModalSearchProduct: false,
    };
    this.onChangeForm = this.onChangeForm.bind(this);
    this.onPress = this.onPress.bind(this);
    this.getTypeForm = this.getTypeForm.bind(this);
    this.templateInputCustomer = this.templateInputCustomer.bind(this);
    this.templateInputProduct = this.templateInputProduct.bind(this);
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.onSelectContact = this.onSelectContact.bind(this);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.onShowAddContactModal = this.onShowAddContactModal.bind(this);
    this.scrollToInput = this.scrollToInput.bind(this);
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
    getProducts(0)
      .then((result) => {
        console.log(result);
      });
  }
  async getTypeForm() {
    const { leadStages } = this.props;
    const stateOptions = {};
    const setStageOption = () => {
      for (let i = 0; i < leadStages.length; i += 1) {
        stateOptions[leadStages[i].id] = leadStages[i].name;
      }
    };
    await setStageOption();
    const type = t.struct({
      name: t.String,
      partner_id: t.Number,
      product: t.Number,
      stage_id: t.enums(stateOptions, 'dropdown'),
      description: t.maybe(t.String),
    });
    this.setState({ type });
  }
  onChangeForm(value) {
    this.setState({ value });
  }
  onPress() {
    if (this.form.getValue()) {
      const value = { ...this.form.getValue(), stage_id: parseInt(this.form.getValue().stage_id, 0) };
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
    if (value === null) {
      this.setState({
        isModalSearchContact: false,
      });
    } else {
      this.setState({
        isModalSearchContact: false,
        value: { ...this.state.value, partner_id: parseInt(value.id, 0) },
        customerName: value.name,
      });
    }
  }
  onSelectProduct(value) {
    if (value === null) {
      this.setState({
        isModalSearchProduct: false,
      });
    } else {
      this.setState({
        isModalSearchProduct: false,
        value: { ...this.state.value, product: parseInt(value.id, 0) },
        productName: value.name,
      });
    }
  }
  onShowAddContactModal(value) {
    this.setState({
      isModalAddContact: value,
    });
  }
  scrollToInput = (event, refName) => {
    const node = ReactNative.findNodeHandle(refName);
    const extraHeight = 200;
    this.scrollView.props.scrollToFocusedInput(node, extraHeight, 100);
  }
  templateInputCustomer() {
    const value = this.state.customerName;
    return (
      <View >
        <Text style={styles.labelForm}>{I18n.t('Customer')}</Text>
        <TextInput
          style={styles.inputFormDisable}
          value={value}
          editable={false}
        />
        <TouchableOpacity
          style={styles.iconInputFormCustom}
          onPress={() => { this.setState({ isModalSearchContact: true }); }}
        >
          <Ionicons name="ios-open-outline" size={25} color={Colors.panther} />
        </TouchableOpacity>
      </View>
    );
  }
  templateInputProduct() {
    const value = this.state.productName;
    return (
      <View >
        <Text style={styles.labelForm}>{I18n.t('product')}</Text>
        <TextInput
          style={styles.inputFormDisable}
          value={value}
          editable={false}
        />
        <TouchableOpacity
          style={styles.iconInputFormCustom}
          onPress={() => { this.setState({ isModalSearchProduct: true }); }}
        >
          <Ionicons name="ios-open-outline" size={25} color={Colors.panther} />
        </TouchableOpacity>
      </View>
    );
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
          ref={(c) => { this.refNode = c; }}
          onFocus={(event) => {
            this.scrollToInput(event, this.refNode);
          }}
        />
      </View>
    );
  }
  get renderSearchContactModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.isModalSearchContact}
        onRequestClose={() => {
          this.setState({ isModalSearchContact: false });
        }}
      >
        <View>
          <ContactsListScreen
            navigation={this.props.navigation}
            isModal
            onSelectContact={value => this.onSelectContact(value)}
            onShowAddContactModal={value => this.onShowAddContactModal(value)}
          />
        </View>
      </Modal>
    );
  }
  get renderSearchProductModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.isModalSearchProduct}
        onRequestClose={() => {
          this.setState({ isModalSearchProduct: false });
        }}
      >
        <View style={{}}>
          <ProductsListScreen
            navigation={this.props.navigation}
            isModal
            onSelectProduct={value => this.onSelectProduct(value)}
          />
        </View>
      </Modal>
    );
  }
  get renderAddContactModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.isModalAddContact}
        onRequestClose={() => {
          this.setState({ isModalAddContact: false });
        }}
      >
        <View>
          <ContactsAddScreen
            navigation={this.props.navigation}
            onShowAddContactModal={value => this.onShowAddContactModal(value)}
            isModal
          />
        </View>
      </Modal>
    );
  }
  render() {
    const { value, isLoading, type } = this.state;
    return (
      <View
        style={[styles.containerHasForm]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps
      >
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header
          title={I18n.t('Add Lead')}
          onPress={() => { this.props.navigation.goBack(null); }}
        />
        <Toast ref={(c) => { this.toast = c; }} />
        {
          isLoading &&
          <View style={[styles.progressBarLoading]}>
            <ActivityIndicator size="large" color={Platform.OS === 'ios' ? 'white' : Colors.fire} />
          </View>
        }
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
          <RoundedButton onPress={this.onPress} text={I18n.t('Save')} />
        </KeyboardAwareScrollView>
        { this.renderSearchContactModal }
        { this.renderSearchProductModal }
        { this.renderAddContactModal }
      </View>
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

