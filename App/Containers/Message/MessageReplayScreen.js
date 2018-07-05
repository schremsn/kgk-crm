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
import { createMessage } from '../../Redux/MessageRedux';
// styles
import { Colors } from '../../Themes/index';
import styles, { stylesheet } from '../Styles/ContainerStyles';


const { Form } = t.form;

class MessageReplayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        body: '',
      },
      res_id: props.navigation.state.params.res_id,
      channel_ids: props.navigation.state.params.channel_ids,
      isLoading: false,
    };
    this.templateInputNotes = this.templateInputNotes.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.options = {
      hasError: true,
      fields: {
        body: {
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
  }
  async getTypeForm() {
    const type = t.struct({
      body: t.maybe(t.String),
    });
    this.setState({ type });
  }
  templateInputNotes() {
    const value = this.state.value.body ? this.state.value.body : '';
    return (
      <Input
        multiline
        label={I18n.t('body')}
        value={value}
        press={(text) => {
          const valueNew = { ...this.state.value, body: text };
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
      const value = { ...this.form.getValue(), res_id: this.state.res_id, channel_ids: this.state.channel_ids };
      this.setState({ isLoading: true });
      createMessage(value)
        .then((res) => {
          this.setState({ isLoading: false });
          ToastAndroid.show(I18n.t('Create message is success'), ToastAndroid.SHORT);
          this.props.navigation.goBack();
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }
  }
  render() {
    const {
      value, isLoading, type,
    } = this.state;
    return (
      <BaseScreen title={I18n.t('Replay Message')} onPress={() => { this.props.navigation.goBack(null); }}>
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
          <RoundedButton onPress={this.onPress} text={I18n.t('Send')} />
        </KeyboardAwareScrollView>
      </BaseScreen>
    );
  }
}

MessageReplayScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  // states: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  // states: state.auth.states,
});

export default connect(mapStateToProps, null)(MessageReplayScreen);
