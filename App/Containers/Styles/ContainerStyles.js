import { StyleSheet, Platform } from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../Themes/';

// Style Form
export const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.controlLabel.normal.color = Colors.silver;
stylesheet.controlLabel.normal.backgroundColor = 'transparent';
stylesheet.controlLabel.error.backgroundColor = 'transparent';
stylesheet.textbox.normal.color = Colors.silver;
stylesheet.textbox.normal.backgroundColor = 'transparent';
stylesheet.textbox.error.backgroundColor = 'transparent';
stylesheet.textbox.normal.height = 45;
stylesheet.textboxView.normal.height = 45;
stylesheet.textboxView.normal.backgroundColor = 'transparent';
stylesheet.textboxView.error.backgroundColor = 'transparent';
stylesheet.textbox.notEditable.height = 45;
stylesheet.textbox.error.color = Colors.silver;
if (Platform.OS !== 'ios') {
  stylesheet.select.normal.color = Colors.silver;
}
stylesheet.select.normal.backgroundColor = 'transparent';

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
    paddingTop: Platform.OS === 'ios' ? 40 : Metrics.doubleBaseMargin,
    padding: Metrics.doubleBaseMargin,
    height: Metrics.screenHeight,
    backgroundColor: 'transparent',
  },
  containerHasForm: {
    padding: Metrics.doubleBaseMargin,
  },
  containerModal: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    // marginHorizontal: Metrics.doubleBaseMargin,
    backgroundColor: Colors.banner,
    opacity: 0.9,
    borderRadius: 4,
  },
  mainContainer: {
    marginBottom: Platform.OS === 'ios' ? 0 : 60,
    height: Metrics.screenHeight,

    // padding: Metrics.doubleBaseMargin,
  },
  mainContainerModal: {
    marginBottom: Platform.OS === 'ios' ? 30 : 60,
  },
  mainContainerHasFormModal: {
    marginBottom: 120,
    backgroundColor: Colors.banner,
    padding: 10,
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
    backgroundColor: 'transparent',
  },
  sectionHeaderContainerModal: {
    // borderWidth: 1,
    // borderColor: Colors.border,
    padding: Metrics.baseMargin,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  sectionHeaderModal: {
    ...Fonts.style.h5,
    color: Colors.fire,
  },
  sectionTextModal: {
    ...Fonts.base,
    color: Colors.banner,
    fontSize: 14,
    lineHeight: Metrics.doubleBaseMargin + 5,
  },
  sectionImage: {
    alignItems: 'center',
    padding: 15,
  },
  progressBar: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
  },
  progressBarLoading: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 70,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
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
    bottom: Platform.OS === 'ios' ? 60 : 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonBoxModal: {
    position: 'absolute',
    right: 30,
    bottom: 30,
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
  boxButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    paddingRight: 20,
    color: 'white',
    backgroundColor: 'transparent',
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
    backgroundColor: Colors.facebook,
  },
  boxLeadTitle: {
    ...Fonts.style.h2,
    color: Colors.snow,
  },
  boxLeadContent: {
    ...Fonts.style.h3,
    color: Colors.snow,
    paddingBottom: 10,
  },
  // style lead list
  boxSearch: {
    paddingBottom: 20,
  },
  inputSearch: {
    backgroundColor: Colors.snow,
    borderRadius: 20,
    paddingLeft: 20,
    height: 40,
  },
  inputText: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
  },
  buttonSearch: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  // style lead detail
  boxLeadPhone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonCallPhone: {
    padding: 5,
    marginLeft: 30,
  },
  boxPicker: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#5f3e63b0',
    justifyContent: 'center',
    alignItems: 'center',

  },
  boxPickerContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 10,
    borderRadius: 10,
  },
  boxActions: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 35 : 60,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#5f3e63b0',
    justifyContent: 'flex-end',
  },
  boxActionContent: {
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  // form
  inputForm: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    paddingLeft: 10,
    fontSize: 17,
    borderRadius: 4,
    height: 45,
    marginTop: 10,
    marginBottom: 12,
  },
  inputFormMulti: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    paddingLeft: 10,
    fontSize: 17,
    borderRadius: 4,
    height: 'auto',
    minHeight: 45,
    marginTop: 20,
    marginBottom: 20,
  },
  inputFormDisable: {
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 10,
    fontSize: 17,
    borderRadius: 4,
    height: 45,
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: '#e2e2e2',
    color: 'black',
  },
  labelForm: {
    fontSize: 17,
    color: 'white',
    fontWeight: '700',
    backgroundColor: 'transparent',

  },
  iconInputFormCustom: {
    position: 'absolute',
    height: 45,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    right: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: 'white',
  },
  linearText: {
    fontWeight: '400',
    fontSize: 25,
    marginTop: 25,
    marginBottom: 60,
  },
  // tag
  selectToggle: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  chipText: {
    color: Colors.snow,
  },
  selectToggleText: {
    color: Colors.snow,
  },

});
