import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Button, Alert, Share } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./theme-context";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type CompletedTimer = {
  name: string;
  completionTime: string;
};

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [completedTimers, setCompletedTimers] = useState<CompletedTimer[]>([]);

  useEffect(() => {
    loadCompletedTimers();
  }, []);

  const loadCompletedTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem("completedTimers");
      if (savedTimers) {
        setCompletedTimers(JSON.parse(savedTimers));
      }
    } catch (error) {
      console.error("Error loading completed timers:", error);
      Alert.alert("Error", "Failed to load completed timers.");
    }
  };

  const exportTimerData = async () => {
    try {
      const completedTimers = await AsyncStorage.getItem("completedTimers");
      const activeTimers = await AsyncStorage.getItem("timers");
      
      const exportData = JSON.stringify({
        completedTimers: JSON.parse(completedTimers || "[]"),
        activeTimers: JSON.parse(activeTimers || "[]")
      }, null, 2);

      const result = await Share.share({
        message: exportData,
        title: "Timer Data Export",
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



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212',
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme === 'light' ? '#000000' : '#FFFFFF',
    },
    timerItem: {
      backgroundColor: theme === 'light' ? "#f0f0f0" : "#2a2a2a",
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
    },
    timerText: {
      color: theme === 'light' ? '#000000' : '#FFFFFF',
    },
    exportButton: {
      marginVertical: 10,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>
      <View style={styles.exportButton}>
        <Button title="Export Timer Data" onPress={exportTimerData} />
      </View>
      {completedTimers.map((timer, index) => (
        <View key={index} style={styles.timerItem}>
          <Text style={styles.timerText}>{timer.name}</Text>
          <Text style={styles.timerText}>Completed: {new Date(timer.completionTime).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}