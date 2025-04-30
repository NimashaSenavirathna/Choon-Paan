import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrdersHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.button, styles.placeOrderButton]}
        onPress={() => navigation.navigate('PlaceOrderScreen')}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>

      <View style={styles.buttonSpacing} />

      {/* Order History Button */}
      <TouchableOpacity
        style={[styles.button, styles.orderHistoryButton]}
        onPress={() => navigation.navigate('OrderHistoryScreen')}
      >
        <Text style={styles.buttonText}>Order History</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
           <TouchableOpacity 
                  onPress={() => navigation.navigate('ChoonHome')} // Navigate to OrdersHome
                  style={{ alignItems: 'center' }}
                >
          <Icon name="home" size={30} color="#333" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('OrdersHome')} style={styles.navItem}>
          <Icon name="car" size={30} color="#007bff" />
          <Text style={[styles.navText, { color: '#007bff' }]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
              onPress={() => navigation.navigate('Activities')} // Navigate to OrdersHome
              style={{ alignItems: 'center' }}
            >
          <Icon name="bars" size={30} color="#333" />
          <Text style={styles.navText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={() => navigation.navigate('InAppSettings')} // Navigate to OrdersHome
                style={{ alignItems: 'center' }}
             >
          <Icon name="cog" size={30} color="#333" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#Fff',
    padding: 20,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  placeOrderButton: {
    backgroundColor: '#007bff',
    shadowColor: '#007bff',
    elevation: 5,
  },
  orderHistoryButton: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSpacing: {
    marginVertical: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
});

export default OrdersHome;
