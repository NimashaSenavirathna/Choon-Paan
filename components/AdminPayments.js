import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const AdminPayments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    const querySnapshot = await getDocs(collection(db, 'paymentHistory'));
    const payments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPaymentHistory(payments);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Payment",
      "Are you sure you want to delete this payment record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'paymentHistory', id));
              setPaymentHistory(paymentHistory.filter(item => item.id !== id));
              Alert.alert("Deleted", "Payment record deleted successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete payment: " + error.message);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const generateReport = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Payment History Report</h1>
          <table>
            <tr>
              <th>Amount</th>
              <th>Card Used</th>
            </tr>
            ${paymentHistory
              .map(
                (item) => `
                  <tr>
                    <td>$${item.amount}</td>
                    <td>${item.cardUsed}</td>
                  </tr>`
              )
              .join('')}
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri); // Share or download the PDF
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>

      {/* Button to generate the report */}
      <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
        <Text style={styles.reportButtonText}>Generate Report</Text>
      </TouchableOpacity>

      <FlatList
        data={paymentHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentText}>Amount: ${item.amount}</Text>
              <Text style={styles.paymentText}>Card Used: {item.cardUsed}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  reportButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  paymentDetails: { flex: 1 },
  paymentText: { fontSize: 18, color: '#333' },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AdminPayments;
