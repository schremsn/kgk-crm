import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView, TextInput, KeyboardAvoidingView } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Images, Colors } from '../../Themes/index';
import styles from '../Styles/ContainerStyles';
import ProgressBar from '../../Components/ProgressBar';
import Header from '../../Components/Header';
import { getCustomers, searchCustomer } from '../../Redux/ContactsRedux';

class ContactListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isKeyboard: false,
      searchContent: '',
      list: [],
    };
    this.getCustomersList = this.getCustomersList.bind(this);
    this.getCustomersListNextPage = this.getCustomersListNextPage.bind(this);
    this.handleSearchLead = this.handleSearchLead.bind(this);
    this.renderContact = this.renderContact.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeSearchLead = this.onChangeSearchLead.bind(this);
  }
  componentWillMount() {
    this.getCustomersList();
  }
  getCustomersList(isRefreshed) {
    this.props.getCustomers(0, (list) => {
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
      const dataSource = ds.cloneWithRows(list);
      this.setState({
        list,
        dataSource,
        isLoading: false,
      });
    });
    if (isRefreshed) {
      this.setState({ isRefreshing: false });
    }
  }
  getCustomersListNextPage() {
    this.props.getCustomers(0, (list) => {
      const data = this.state.list;
      list.map(item => data.push(item));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getCustomersList('isRefreshed');
  }
  onChangeSearchLead(searchContent) {
    this.setState({ searchContent });
  }
  handleSearchLead() {
    const { searchContent } = this.state;
    if(searchContent.length > 0){
      searchCustomer(searchContent)
        .then((list) => {
          const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
          const dataSource = ds.cloneWithRows(list);
          this.setState({
            list,
            dataSource,
            isKeyboard: false
          });
        });
    }
  }
  renderContact(item) {
    return (
      <TouchableOpacity
        style={styles.sectionHeaderContainer}
        onPress={() => {
          if (this.props.isModal) {
            this.props.onSelectContact(item);
          } else {
            this.props.navigation.navigate('ContactDetailScreen', { contactId: item.id});
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
    const { isLoading, isRefreshing, isKeyboard, dataSource } = this.state;
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header
          title={I18n.t('Contacts')}
          onPress={() => {
          if (this.props.isModal) {
            this.props.onSelectContact(null);
          } else {
            this.props.navigation.goBack(null);
          }
        }}
        />
        <KeyboardAvoidingView behavior="height" style={styles.boxSearch}>
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
        </KeyboardAvoidingView>
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
              style={[styles.mainContainer, { marginBottom: this.props.isModal ? 20 : 60 }]}
              enableEmptySections
              // onEndReached={() => this.getCustomersListNextPage()}
              onEndReachedThreshold={1200}
              dataSource={dataSource}
              renderRow={item => this.renderContact(item)}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              // renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
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
            />
        }
        <TouchableOpacity
          style={[styles.buttonBox]}
          onPress={() => {
            if (this.props.isModal) {
              this.props.onShowAddContactModal(true);
            } else {
              this.props.navigation.navigate('ContactsAddScreen');
            }
        }}
        >
          <View style={styles.button}>
            <Ionicons name="ios-add-outline" size={25} color={Colors.snow} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  offset: state.contacts.offset,
});

const mapDispatchToProps = dispatch => ({
  getCustomers: (offset, cb) => { dispatch(getCustomers(offset, cb)); },
  searchCustomer: (searchTerm, cb) => { dispatch(searchCustomer(searchTerm, cb)); },
});

ContactListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getCustomers: PropTypes.func.isRequired,
  onSelectContact: PropTypes.func,
  onShowAddContactModal: PropTypes.func,
  isModal: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactListScreen);
