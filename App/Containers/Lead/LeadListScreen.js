import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, RefreshControl, ListView, TextInput, Keyboard } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/ContainerStyles';
import { Colors } from '../../Themes/index';
import { getLeadbyStage, searchLead } from '../../Redux/LeadRedux';
import BaseScreen from '../../Components/BaseScreen';

class LeadListScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      isFetching: true,
      isError: false,
      isRefreshing: false,
      searchContent: '',
      dataSource: ds.cloneWithRows([]),
      stageName: props.navigation.state.params.stageName,
    };
    this.getLeadsList = this.getLeadsList.bind(this);
    // this.getLeadsListNextPage = this.getLeadsListNextPage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
    this.handleSearchLead = this.handleSearchLead.bind(this);
  }
  componentWillMount() {
    this.getLeadsList();
  }
  getLeadsList(isRefreshed) {
    const { stageId } = this.props.navigation.state.params;
    getLeadbyStage(stageId)
      .then((list) => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(list);
        this.setState({
          dataSource,
          isFetching: false,
          isRefreshing: false,
        });
      })
      .catch(() => {
        this.setState({ isFetching: false, isError: true, isRefreshing: false });
      });
  }
  onRefresh() {
    this.setState({ isRefreshing: true, isError: false });
    this.getLeadsList('isRefreshed');
  }
  renderProduct(item) {
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.navigate('LeadDetailScreen', { leadId: item.id }); }} style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{item.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('id')}: {item.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('customer')}: {item.partner_name}</Text>
        <Text style={styles.sectionText}>{I18n.t('contact')}: {item.contact_name}</Text>
        <Text style={styles.sectionText}>{I18n.t('city')}: {item.city}</Text>
        <Text style={styles.sectionText}>{I18n.t('phone')}: {item.phone}</Text>
      </TouchableOpacity>
    );
  }
  handleSearchLead() {
    Keyboard.dismiss();
    const { searchContent } = this.state;
    searchLead(searchContent)
      .then((list) => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(list);
        this.setState({
          dataSource,
        });
      });
  }
  render() {
    const {
      stageName, isFetching, isRefreshing, isError, dataSource,
    } = this.state;
    return (
      <BaseScreen
        title={stageName}
        onPress={() => { this.props.navigation.goBack(null); }}
        fullLoading={isFetching}
        isError={isError}
        onRefresh={this.onRefresh}
        circleButton={() => { this.props.navigation.navigate('LeadAddScreen'); }}
      >
        <View style={styles.boxSearch}>
          <TextInput
            style={styles.inputSearch}
            underlineColorAndroid="transparent"
            placeholder={I18n.t('search for name, city')}
            onChangeText={searchContent => this.setState({ searchContent })}
            returnKeyType="search"
            onEndEditing={this.handleSearchLead}
          />
          <TouchableOpacity style={styles.buttonSearch} onPress={() => this.handleSearchLead()}>
            <Ionicons name="ios-search-outline" size={25} color={Colors.banner} />
          </TouchableOpacity>
        </View>
        <ListView
          style={styles.mainContainerModal}
          enableEmptySections
          onEndReachedThreshold={1200}
          dataSource={dataSource}
          renderRow={item => this.renderProduct(item)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
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
      </BaseScreen>
    );
  }
}

LeadListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(null, null)(LeadListScreen);
