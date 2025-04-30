import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const PaymentScreen = () => {
  const [cards, setCards] = useState([]);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const price = route.params?.price;
  const db = getFirestore();

  useEffect(() => {
    const fetchCards = async () => {
      const snapshot = await getDocs(collection(db, 'cards'));
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCards();
  }, []);

  const handlePayment = async (card) => {
    if (!card) {
      Alert.alert('Error', 'Please select a card to make the payment.');
      return;
    }

    const paymentData = {
      amount: price,
      cardUsed: `**** **** **** ${card.cardNumber.slice(-4)}`,
      date: new Date().toLocaleString(),
    };

    try {
      // Save payment history in Firestore
      await addDoc(collection(db, 'paymentHistory'), paymentData);

      setReceiptData(paymentData);
      setReceiptVisible(true); // Show receipt popup

    } catch (error) {
      Alert.alert('Error', 'Failed to save payment history.');
      console.error(error);
    }
  };

  const generateReport = async () => {
    if (!receiptData) return;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Payment Receipt</h2>
          <p><strong>Amount Paid:</strong> $${receiptData.amount}</p>
          <p><strong>Card Used:</strong> ${receiptData.cardUsed}</p>
          <p><strong>Date:</strong> ${receiptData.date}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri); // Share or download the PDF
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Total amount: Rs.{price}</Text>

      <Text style={styles.cardHeader}>Select a Card to Pay</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>**** **** **** {item.cardNumber.slice(-4)}</Text>
            <Text>{item.expiryDate} - {item.cardHolder}</Text>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handlePayment(item)}
            >
              <Text style={styles.buttonText}>Pay with this Card</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Receipt Modal */}
      <Modal visible={receiptVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Payment Successful</Text>
            {receiptData && (
              <>
                <Text style={styles.modalText}>Amount: ${receiptData.amount}</Text>
                <Text style={styles.modalText}>Card: {receiptData.cardUsed}</Text>
                <Text style={styles.modalText}>Date: {receiptData.date}</Text>

                <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
                  <Text style={styles.buttonText}>Generate Report</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setReceiptVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  cardHeader: { fontSize: 20, marginBottom: 15, fontWeight: 'bold' },
  card: { padding: 15, borderBottomWidth: 1, marginBottom: 10 },
  selectButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 18, marginVertical: 5 },
  reportButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10 },
  closeButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, marginTop: 10 },
});

export default PaymentScreen;
