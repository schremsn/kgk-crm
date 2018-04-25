import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, RefreshControl, ListView } from 'react-native';
import I18n from 'react-native-i18n';
import ProgressBar from '../Components/ProgressBar';
import { getMessages } from '../Redux/MessageRedux';
import styles from './Styles/ContainerStyles';
import { Images, Colors } from './../Themes';

class MessagesListScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isRefreshing: false,
    };

    this.getMessages = this.getMessages.bind(this);
    this.getMessagesNextPage = this.getMessagesNextPage.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.getMessages();
  }

  getMessages(isRefreshed) {
    this.props.getMessages(50, (list) => {
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
  getMessagesNextPage() {
    this.props.getMessages(this.props.offset, (list) => {
      const data = this.state.list;
      list.map(item => data.push(item));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
      });
    });
  }
  onRefresh() {
    this.setState({ isRefreshing: true });
    this.getMessages('isRefreshed');
  }
  renderMessage(item) {
    const data = item;
    const channel = this.props.mailChannels.filter(ch => ch.id === item.channel_ids[0])[0];
    data.channel = channel.name || '';
    return (
      <TouchableOpacity style={styles.sectionHeaderContainer} onPress={() => { this.props.navigation.navigate('MessageDetailScreen', { messageDetail: data }); }} >
        <Text style={styles.sectionHeader}>{I18n.t('date')} : {item.date}</Text>
        <Text style={styles.sectionText}>{I18n.t('from')}: {item.email_from}</Text>
        <Text style={styles.sectionText}>{I18n.t('channel')}: {channel && channel.name}</Text>
        <Text style={styles.sectionText}>{I18n.t('message')}: {item.body && item.body.substring(0, 40)}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    const { isLoading, isRefreshing, dataSource } = this.state;
    return (
      <View style={[styles.container]}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
        {
          isLoading
            ? <ProgressBar isRefreshing={isRefreshing} onRefresh={this.onRefresh} />
            : <ListView
              style={styles.mainContainer}
              enableEmptySections
              onEndReached={this.getMessagesNextPage}
              onEndReachedThreshold={1200}
              dataSource={dataSource}
              renderRow={item => this.renderMessage(item)}
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
const mapStateToProps = state => ({
  offset: state.message.offset,
  mailChannels: state.auth.mailChannels,
});

const mapDispatchToProps = dispatch => ({
  getMessages: (offset, cb) => { dispatch(getMessages(offset, cb)); },
});
MessagesListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  offset: PropTypes.number.isRequired,
  mailChannels: PropTypes.array.isRequired,
  getMessages: PropTypes.func.isRequired,
};

MessagesListScreen.navigationOptions = {
  title: I18n.t('messages'),
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesListScreen);
