import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import styles from '../Styles/ContainerStyles';
import { Images, Colors } from '../../Themes/index';
import { pipelineCount, getLeadStages } from '../../Redux/LeadRedux';
import BaseScreen from '../../Components/BaseScreen';

class LeadStagesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leadStages: props.leadStages,
      isLoading: true,
      isRefreshing: false,
      list: {},
    };
    this.getPipelineCount = this.getPipelineCount.bind(this);
    this.getLeadStages = this.getLeadStages.bind(this);
    this.renderLeadStage = this.renderLeadStage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.getPipelineCount();
    this.getLeadStages();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.leadStages) {
      this.setState({ leadStages: nextProps.leadStages });
    }
  }
  getPipelineCount(isRefreshed) {
    pipelineCount()
      .then((list) => {
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
    this.props.getLeadStages();
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
    return (
      <BaseScreen
        fullLoading={isLoading}
        onRefresh={this.onRefresh}
      >
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
      </BaseScreen>
    );
  }
}

const mapStateToProps = state => ({
  leadStages: state.lead.list,
});

const mapDispatchToProps = dispatch => ({
  getLeadStages: () => { dispatch(getLeadStages()); },
});

LeadStagesScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  leadStages: PropTypes.array.isRequired,
  getLeadStages: PropTypes.func.isRequired,
};
LeadStagesScreen.navigationOptions = {
  title: I18n.t('pipeline'),
};

export default connect(mapStateToProps, mapDispatchToProps)(LeadStagesScreen);
