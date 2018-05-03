import { StyleSheet } from 'react-native';
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  applicationView: {
    flex: 1,
  },
  sectionText: {
    ...Fonts.base,
    color: Colors.text,
    fontSize: 14,
    lineHeight: Metrics.doubleBaseMargin + 5,
  },
  container: {
    padding: Metrics.doubleBaseMargin,
    height: Metrics.screenHeight,
  },
  mainContainer: {

  },
  description: {
    marginVertical: Metrics.doubleSection,
  },
  sectionHeader: {
    ...Fonts.style.h5,
    color: Colors.fire,
  },
  sectionHeaderContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Metrics.baseMargin,
    marginBottom: 20,
  },
  sectionImage: {
    alignItems: 'center',
    padding: 15,
  },
  progressBar: {
    backgroundColor: 'transparent',
    flex: 1,
    minHeight: Metrics.screenHeight,
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seperator: {
    backgroundColor: '#8E8E8E',
  },
  thumpImage: {
    width: 100,
    height: 100,
  },
  buttonBox: {
    position: 'absolute',
    right: 30,
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    paddingRight: 20,
    color: 'white',
  },
  // Style Car
  cardTitle: {
    alignSelf: 'center',
    fontSize: Fonts.size.regular,
    fontWeight: 'bold',
    marginVertical: Metrics.baseMargin,
    color: Colors.snow,
  },
  cardContainer: {
    backgroundColor: Colors.ember,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    shadowColor: Colors.panther,
    shadowOffset: {
      height: 7,
      width: 7,
    },
    shadowRadius: 2,
    paddingBottom: Metrics.baseMargin,
    margin: Metrics.baseMargin,
  },
  rowContainer: {
    flexDirection: 'row',
    borderColor: Colors.windowTint,
    borderWidth: 0.5,
    borderRadius: 2,
  },
  rowLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.snow,
  },
  rowLabel: {
    fontWeight: 'bold',
    fontSize: Fonts.size.medium,
    marginVertical: Metrics.baseMargin,
    marginLeft: Metrics.baseMargin,
  },
  rowInfoContainer: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: Colors.silver,
  },
  rowInfo: {
    fontSize: Fonts.size.regular,
    margin: Metrics.baseMargin,
  },
  cardStyle: {
    marginTop: 10,
    backgroundColor: 'white',
    height: 50,
    paddingTop: 10,
    paddingLeft: 10,
  },
  // style lead statges
  boxLeadStage: {
    // borderWidth: 1,
    // borderColor: Colors.border,
    borderRadius: 10,
    padding: Metrics.baseMargin,
    marginBottom: 20,
    backgroundColor: Colors.bloodOrange
  },
  boxLeadTitle: {
    ...Fonts.style.h2,
    color: Colors.snow,
  },
  boxLeadContent: {
    ...Fonts.style.h3,
    color: Colors.snow,
    paddingBottom: 10
  },
  // style lead list
  boxSearch: {
    paddingBottom: 20
  },
  inputSearch: {
    backgroundColor: Colors.snow,
    borderRadius: 20,
    paddingLeft: 20
  },

});
