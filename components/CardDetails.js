import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CardDetails = () => {
  const navigation = useNavigation();
  const db = getFirestore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const handleAddCard = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, 'cards'), {
        cardNumber,
        expiryDate,
        cvv,
        cardHolder
      });

      Alert.alert("Success", "Card added successfully!");
      navigation.navigate('ManageCards');
    } catch (error) {
      Alert.alert("Error", "Failed to add card: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
        placeholder="1234 5678 9012 3456"
      />

      <Text style={styles.label}>Expiry Date</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />

      <Text style={styles.label}>CVV</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={3}
        value={cvv}
        onChangeText={setCvv}
        secureTextEntry={true}
      />

      <Text style={styles.label}>Cardholder Name</Text>
      <TextInput
        style={styles.input}
        value={cardHolder}
        onChangeText={setCardHolder}
        placeholder="John Doe"
      />

      <TouchableOpacity style={styles.button} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginTop: 5 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
});

export default CardDetails;
