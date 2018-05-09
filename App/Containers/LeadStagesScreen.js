import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import styles from './Styles/ContainerStyles';
import { Images, Colors } from './../Themes';
import ProgressBar from '../Components/ProgressBar';
import { pipelineCount, getLeadStages } from '../Redux/LeadRedux';

class LeadStagesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leadStages: props.leadStages || [],
      isLoading: true,
      isRefreshing: false,
      list: {},
    };
    this.getPipelineCount = this.getPipelineCount.bind(this);
    this.renderLeadStage = this.renderLeadStage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.getPipelineCount();
    this.getLeadStages();
  }
  getPipelineCount(isRefreshed) {
    this.props.getPipelineCount((list) => {
      this.setState({
        list,
        isLoading: false,
      });
    });
    if (isRefreshed) {
      this.setState({ isRefreshing: false });
    }
  }
  getLeadStages() {
    this.props.getLeadStages((leadStages) => {
      this.setState({
        leadStages,
        isLoading: false,
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getPipelineCount('isRefreshed');
  }
  renderLeadStage(item) {
    const countCurrentStage = this.state.list[item.id] || 0;
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => { this.props.navigation.navigate('LeadListScreen', { stageId: item.id, stageName: item.name }); }}
        style={styles.boxLeadStage}
      >
        <Text style={styles.boxLeadTitle}>{item.name.toUpperCase()}</Text>
        <Text style={styles.boxLeadContent}>{countCurrentStage}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const { isLoading, isRefreshing, leadStages } = this.state;
    console.log(leadStages);
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        <ScrollView
          style={styles.mainContainer}
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
        >
          {
            leadStages.map(item => (
              this.renderLeadStage(item)
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  leadStages: state.lead.list,
});

const mapDispatchToProps = dispatch => ({
  getPipelineCount: (cb) => { dispatch(pipelineCount(cb)); },
  getLeadStages: (cb) => { dispatch(getLeadStages(cb)); },
});

LeadStagesScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  getPipelineCount: PropTypes.func.isRequired,
};
LeadStagesScreen.navigationOptions = {
  title: I18n.t('pipeline'),
};

export default connect(mapStateToProps, mapDispatchToProps)(LeadStagesScreen);
