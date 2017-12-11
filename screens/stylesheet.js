import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    marginTop: 22,
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    width: 20,
    height: 20,
  },
  itemLead: {
    padding: 5,
    height: 100,
    width: '100%',
  },
  itemLeadName: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  itemLeadContactName: {
    fontSize: 20
  },
  circle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 50,
  },
  itemCustomerLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCustomerRight: { flex: 5, marginLeft: 30 },
  itemCustomerName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemCustomer: {
    padding: 5,
    height: 100,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
  },
  itemCustomerCity: {},
  itemCustomerMobile: {},
  newCustomerbutton: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
    borderWidth: 1,
    height: 50,
    width: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  mess: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHome: {
    padding: 5,
    fontSize: 16,
    height: 36,
    width: '100%',
  },
  headerHome: {
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    height: 36,
    width: '100%',
  },

});
