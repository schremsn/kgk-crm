import React from 'react';
import { WebView } from 'react-native';
import i18n from './translation/i18n';


export default class WebViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
    };
  }

  static navigationOptions = {
    tabBarLabel: i18n.t('product'),
  };

  componentWillMount() {
    this.setState({ url: this.props.navigation.state.params.url });
  }

  render() {
    return (
      <WebView
        source={{ uri: this.state.url }}
      />
    );
  }
}
