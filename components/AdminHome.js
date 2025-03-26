import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const AdminHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Admin Home!</Text>
      <Text style={styles.text}>You are logged in as an Admin.</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.replace('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});

export default AdminHome;
