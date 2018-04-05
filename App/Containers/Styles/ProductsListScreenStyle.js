import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics, ApplicationStyles } from '../DevTheme/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  sectionText: {
    ...Fonts.base,
    color: Colors.text,
    fontSize: 12,
    lineHeight: Metrics.doubleBaseMargin + 5
  },
  mainContainer: {
    paddingHorizontal: Metrics.doubleBaseMargin
  },
  description: {
    marginVertical: Metrics.doubleSection
  },
  sectionHeader: {
    ...Fonts.style.h5,
    color: Colors.fire
  },
  sectionHeaderContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Metrics.baseMargin,
    marginVertical: 20
  },
  sectionImage: {
    alignItems: 'center',
    padding: 15
  },
  progressBar: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  seperator: {
    marginTop: 10,
    backgroundColor: '#8E8E8E'
  },
  thumpImage: {
    width: 100,
    height: 100
  }
})
