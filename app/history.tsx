import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Button, Alert, Share } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

type CompletedTimer = {
  name: string;
  completionTime: string;
};

export default function HistoryScreen() {
  const [completedTimers, setCompletedTimers] = useState<CompletedTimer[]>([]);

  useEffect(() => {
    loadCompletedTimers();
  }, []);

  const exportTimerData = async () => {
    try {
      const completedTimers = await AsyncStorage.getItem("completedTimers");
      const activeTimers = await AsyncStorage.getItem("timers");
      
      const exportData = JSON.stringify({
        completedTimers: JSON.parse(completedTimers || "[]"),
        activeTimers: JSON.parse(activeTimers || "[]")
      }, null, 2);

      const fileName = 'timer_export.json';
      const filePath = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(filePath, exportData, { encoding: FileSystem.EncodingType.UTF8 });
      
      const result = await Share.share({
        url: filePath,
        message: 'Here is your exported timer data',
      });

      if (result.action === Share.sharedAction) {
        Alert.alert("Export Successful", "Data exported and shared successfully");
      } else if (result.action === Share.dismissedAction) {
        Alert.alert("Export Cancelled", "Data export was cancelled");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Export Failed", "There was an error exporting the data.");
    }
  };

  const loadCompletedTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem("completedTimers");
      if (savedTimers) {
        const parsedTimers = JSON.parse(savedTimers) as CompletedTimer[];
        setCompletedTimers(parsedTimers.reverse()); // Reverse to show most recent first
      }
    } catch (error) {
      console.error("Error loading completed timers:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>
      <Button title="Export Timer Data" onPress={exportTimerData} />
      {completedTimers.length === 0 ? (
        <Text>No completed timers yet.</Text>
      ) : (
        completedTimers.map((timer, index) => (
          <View key={index} style={styles.timerItem}>
            <Text>{timer.name}</Text>
            <Text>Completed: {new Date(timer.completionTime).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timerItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});