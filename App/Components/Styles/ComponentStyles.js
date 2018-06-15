import { StyleSheet } from 'react-native';
import { Metrics, Colors } from '../../Themes';

export default StyleSheet.create({
  // header
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: Metrics.doubleBaseMargin,
    backgroundColor: 'transparent'

  },
  boxButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  textTitle: {
    color: Colors.snow,
    fontSize: 23,
    fontWeight: '600',
    backgroundColor: 'transparent'
  },
  // wallpaper
  picture: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: Metrics.screenHeight,

  },
  box: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  // form
  container: {
    flex: 1,
    alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    top: 70,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    zIndex: 1,
    tintColor: 'rgba(0,0,0,0.2)',
  },
});
