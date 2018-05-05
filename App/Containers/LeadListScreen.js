import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView, TextInput } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './Styles/ContainerStyles';
import { Images, Colors } from './../Themes';
import { getLeads, getLeadbyStage, searchLead } from '../Redux/LeadRedux';
import ProgressBar from '../Components/ProgressBar';
import Header from '../Components/Header';

class LeadListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      searchContent: '',
      stageName: props.navigation.state.params.stageName
    };
    this.getLeadsList = this.getLeadsList.bind(this);
    // this.getLeadsListNextPage = this.getLeadsListNextPage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeSearchLead = this.onChangeSearchLead.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
    this.handleSearchLead = this.handleSearchLead.bind(this);
  }
  componentWillMount() {
    this.getLeadsList();
  }
  getLeadsList(isRefreshed) {
    const { stageId } = this.props.navigation.state.params;
    this.props.getLeadByStage(stageId, (list) => {
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
  // getLeadsListNextPage() {
  //   this.props.getLeads((list) => {
  //     const data = this.state.list;
  //     list.map(item => data.push(item));
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(data),
  //     });
  //   });
  // }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getLeadsList('isRefreshed');
  }
  renderProduct(item) {
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.navigate('LeadDetailScreen', { leadId: item.id }); }} style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{item.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('id')}: {item.id}</Text>
        <Text style={styles.sectionText}>{I18n.t('customer')}: {item.partner_name}</Text>
        <Text style={styles.sectionText}>{I18n.t('contact')}: {item.contact_name}</Text>
        {/*<Text style={styles.sectionText}>email_from: {item.email_from}</Text>*/}
        {/*<Text style={styles.sectionText}>title_action: {item.title_action}</Text>*/}
        <Text style={styles.sectionText}>{I18n.t('city')}: {item.city}</Text>
        <Text style={styles.sectionText}>{I18n.t('phone')}: {item.phone}</Text>
      </TouchableOpacity>
    );
  }
  onChangeSearchLead(searchContent){
    this.setState({ searchContent})
  }
  handleSearchLead(){
    const { searchContent } = this.state;
    this.props.searchLead(searchContent, (list)=>{
      const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
      const dataSource = ds.cloneWithRows(list);
      this.setState({
        list,
        dataSource,
      });
    })
  }
  render() {
    const { isLoading, isRefreshing, dataSource, stageName } = this.state;
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <Header title={stageName} onPress={() => this.props.navigation.goBack(null)} />
        <View style={styles.boxSearch}>
          <TextInput
            style={styles.inputSearch}
            underlineColorAndroid='transparent'
            placeholder={I18n.t('search for name, city')}
            onChangeText={(value) => this.onChangeSearchLead(value)}
            returnKeyType={'search'}
            onEndEditing={this.handleSearchLead}
          />
          <TouchableOpacity style={styles.buttonSearch} onPress={() => this.handleSearchLead()}>
            <Ionicons name='ios-search-outline' size={25} color={Colors.banner} />
          </TouchableOpacity>
        </View>
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
              style={styles.mainContainer}
              enableEmptySections
              // onEndReached={() => this.getLeadsListNextPage()}
              onEndReachedThreshold={1200}
              dataSource={dataSource}
              renderRow={item => this.renderProduct(item)}
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
      </View>
    );
  }
}

LeadListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getLeads: PropTypes.func.isRequired,
  searchLead: PropTypes.func.isRequired,
  getLeadByStage: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  offset: state.product.offset,
});

const mapDispatchToProps = dispatch => ({
  getLeadByStage: (stageid, cb) => { dispatch(getLeadbyStage(stageid, cb)); },
  getLeads: (cb) => { dispatch(getLeads(cb)); },
  searchLead: (searchTerm, cb) => { dispatch(searchLead(searchTerm, cb)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadListScreen);
