import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import StartupActions from '../Redux/StartupRedux';
import { initState } from '../Redux/ProductRedux';
import ReduxPersist from '../Config/ReduxPersist';

// Styles
import styles from './Styles/ContainerStyles';

class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup();
    }
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
        <ReduxNavigation />
      </View>
    );
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
  startup: () => dispatch(StartupActions.startup(), initState()),
});

export default connect(null, mapDispatchToProps)(RootContainer);
