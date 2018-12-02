import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ListView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../Themes/index';
import styles from '../Styles/ContainerStyles';
import BaseScreen from '../../Components/BaseScreen';
import { getCustomers, searchCustomer } from './ContactsRedux';

class ContactListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
      searchContent: '',
      data: [],
      offset: 0,
    };
    this.handleSearchLead = this.handleSearchLead.bind(this);
    this.renderContact = this.renderContact.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeSearchLead = this.onChangeSearchLead.bind(this);
  }
  componentWillMount() {
    this.getCustomersList();
  }

  getCustomersList = async (isRefreshed) => {
    await getCustomers(0)
      .then((resolveData) => {
        console.log(resolveData);
        this.setState({
          data: resolveData.data,
          isLoading: false,
          offset: resolveData.newOffset,
        });
      });
    if (isRefreshed) {
      this.setState({ isRefreshing: false });
    }
  }

  getCustomersListNextPage = () => {
    const { offset, data, isLoading } = this.state;
    if (!isLoading) {
      getCustomers(offset)
        .then((resolveData) => {
          const newData = [...data, ...resolveData.data];
          this.setState({
            data: newData,
            offset: resolveData.newOffset,
          });
        });
    }
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getCustomersList('isRefreshed');
  }
  onChangeSearchLead(searchContent) {
    this.setState({ searchContent });
  }
  handleSearchLead() {
    Keyboard.dismiss();
    const { searchContent } = this.state;
    if (searchContent.length > 0) {
      searchCustomer(searchContent)
        .then((data) => {
          this.setState({
            data,
          });
        });
    }
  }
  renderContact(item) {
    return (
      <TouchableOpacity
        style={styles.sectionHeaderContainer}
        onPress={() => {
          if (this.props.navigation.state.params && this.props.navigation.state.params.onSelectContact) {
            this.props.navigation.state.params.onSelectContact(item);
          } else {
            this.props.navigation.navigate('ContactDetailScreen', { contactId: item.id });
          }
        }}
      >
        <Text style={styles.sectionHeader}>{item.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('Company')}: {item.company_name}</Text>
        <Text style={styles.sectionText}>{I18n.t('name')}: {item.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('City')}: {item.city}</Text>
        <Text style={styles.sectionText}>{I18n.t('Mobile')}: {item.mobile}</Text>
        <Text style={styles.sectionText}>{I18n.t('Phone')}: {item.phone}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const {
      isLoading, isRefreshing, data,
    } = this.state;
    const { navigation } = this.props;

    const header = {
      title: I18n.t('Contacts'),
    };
    return (
      <BaseScreen
        fullLoading={isLoading}
        header={header}
        navigation={navigation}
      >
        <View behavior="height" style={styles.mainContainer}>
          <View style={styles.boxSearch}>
            <TextInput
              style={styles.inputSearch}
              underlineColorAndroid="transparent"
              placeholder={I18n.t('search for name, city')}
              onChangeText={value => this.onChangeSearchLead(value)}
              returnKeyType="search"
              onEndEditing={this.handleSearchLead}
            />
            <TouchableOpacity style={styles.buttonSearch} onPress={() => this.handleSearchLead()}>
              <Ionicons name="ios-search-outline" size={25} color={Colors.banner} />
            </TouchableOpacity>
          </View>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
                colors={[Colors.fire]}
                tintColor={Colors.snow}
                title={`${I18n.t('loading')}...`}
                titleColor={Colors.snow}
                progressBackgroundColor={Colors.snow}
              />
            }
            style={[styles.mainContainerModal]}
            onEndReached={this.getCustomersListNextPage}
            onEndReachedThreshold={0.2}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => this.renderContact(item)}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
            // renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
            ListFooterComponent={(
              isLoading ? (
                <View style={{
                  height: 100, alignItems: 'center', justifyContent: 'center', width: '100%',
                }}
                >
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : <View />)}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity
            style={[styles.buttonBox]}
            onPress={() => { this.props.navigation.navigate('ContactsAddScreen'); }}
          >
            <View style={styles.button}>
              <Ionicons name="ios-add-outline" size={25} color={Colors.snow} />
            </View>
          </TouchableOpacity>
        </View>

      </BaseScreen>
    );
  }
}

const mapStateToProps = state => ({
  offset: state.contacts.offset,
});

const mapDispatchToProps = dispatch => ({
  searchCustomer: (searchTerm, cb) => { dispatch(searchCustomer(searchTerm, cb)); },
});

ContactListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactListScreen);
