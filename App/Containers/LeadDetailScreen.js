import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, Image } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import styles from './Styles/ContainerStyles';
import { Images, Metrics } from './../Themes';
import { getLead } from '../Redux/LeadRedux';
import Header from '../Components/Header';

const data = [
  { name: 'id', value: 'Id' },
  { name: 'name', value: 'Lead name' },
  { name: 'contact_name',value: 'Contact' },
  { name: 'partner_name',value: 'Customer' },
  { name: 'phone', value: 'Phone' },
  { name: 'mobile', value: 'Mobile' },
  { name: 'street', value: 'Street' },
  { name: 'street2', value: 'Street2' },
  { name: 'city', value: 'City' },
  { name: 'zip', value: 'Zip' },
  { name: 'email_from', value: 'Email' },
  { name: 'description', value: 'Description' },
  { name: 'stage_id', value: 'Stage' },
  ];
class LeadDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      leadDetail: [],
    };
    this.renderCard = this.renderCard.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }
  componentWillMount() {
    const { leadId } = this.props.navigation.state.params;
    this.props.getLeadById(leadId, (leadDetail) => {
      this.setState({ leadDetail });
    });
  }
  renderCard(cardTitle, rowData) {
    return (
      <View style={{paddingBottom: 100}}>
        {this.renderRows(rowData)}
      </View>
    );
  }
  renderRows(rowData) {
    return (
      data.map(item => (
        <View key={item.name} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{item.value}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            {
              item.name === 'stage_id'
              ? <Text style={styles.rowInfo}>{rowData.stage_id[0]}</Text>
              : <Text style={styles.rowInfo}>{rowData[item.name]}</Text>
            }
          </View>
        </View>))
    );
  }
  render() {
    const { leadDetail } = this.state;
    console.log(leadDetail)
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <Header title="lead detail" onPress={() => this.props.navigation.goBack(null)} />
        <ScrollView style={[styles.mainContainer]}>
          {leadDetail[0] && this.renderCard('Lead Information', leadDetail[0])}
        </ScrollView>
      </View>
    );
  }
}

LeadDetailScreen.navigationOptions = {
  title: I18n.t('product detail'),
};
LeadDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getLeadById: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getLeadById: (leadId, cb) => { dispatch(getLead(leadId, cb)); },
});

export default connect(null, mapDispatchToProps)(LeadDetailScreen);
