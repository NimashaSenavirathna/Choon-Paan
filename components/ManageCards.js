import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ManageCards = () => {
  const navigation = useNavigation();
  const db = getFirestore();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const snapshot = await getDocs(collection(db, 'cards'));
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCards();
  }, []);

  const handleDeleteCard = async (id) => {
    try {
      await deleteDoc(doc(db, 'cards', id));
      setCards(cards.filter(card => card.id !== id));
      Alert.alert("Success", "Card deleted!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete card: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>**** **** **** {item.cardNumber.slice(-4)}</Text>
            <Text>{item.expiryDate} - {item.cardHolder}</Text>
            
            <View style={styles.buttonContainer}>
              {/* Update button navigation */}
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress={() => navigation.navigate('UpdateCard', { cardId: item.id })}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCard(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CardDetails')}>
        <Text style={styles.buttonText}>+ Add New Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  card: { padding: 15, borderBottomWidth: 1, marginBottom: 10 },
  cardText: { fontSize: 18, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  updateButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginRight: 5 },
  deleteButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 },
  addButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
});

export default ManageCards;
