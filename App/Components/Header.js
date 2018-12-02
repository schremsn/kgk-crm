import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Metrics } from '../Themes';

const styles = StyleSheet.create({
  header_container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    elevation: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: 'transparent',
    height: 55,
  },
  header_left: {
    width: 55,
  },
  header_title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_right: {
    width: 55,
  },
  textTitle: {
    fontSize: 16,
    color: Colors.snow,
    fontWeight: 'bold',
  },
});
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.renderGoBackButton = this.renderGoBackButton.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigation.goBack(null);
  }

  renderGoBackButton() {
    const { goBack } = this.props;
    if (!goBack) {
      return null;
    }
    return (
      <View style={styles.header_left}>
        <TouchableOpacity
          style={{
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
      }}
          onPress={this.goBack}
        >
          <Icon name="ios-arrow-back-outline" style={{ }} size={25} color={Colors.snow} />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const {
      titleStyles,
      header,
      headerRight,
      headerLeft,
    } = this.props;
    const title = header && header.title;
    if (!header) return null;
    return (
      <View style={styles.header_container}>
        {
          headerLeft ?
            <View style={styles.header_left}>
              {
                headerLeft
              }
            </View> :
            this.renderGoBackButton()
          }
        <View style={styles.header_title}>
          <Text style={[titleStyles, styles.textTitle]}>{title.toUpperCase()}</Text>
        </View>
        {
          headerRight &&
          <View style={styles.header_right}>
            {headerRight}
          </View>
        }
      </View>

    );
  }
}

Header.defaultProps = {
  title: '',
  goBack: true,
  headerRight: null,
  headerLeft: null,
  titleStyles: {},
};

