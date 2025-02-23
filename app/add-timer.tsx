import React, { useState } from "react";
import { View, Text, TextInput, Button, Switch, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./theme-context";

export default function AddTimerScreen() {
  const router = useRouter();
  const { theme } = useTheme(); // Use the theme
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const saveTimer = async () => {
    if (!name || !duration || !category) return;
    const timestamp = Date.now();
    const newTimer = {
      name: name, // Concatenate strings instead of using template literals
      duration: parseInt(duration),
      remaining: parseInt(duration),
      category,
      status: "Pending" as const,
      halfwayAlert,
    };
    const existingTimers = JSON.parse((await AsyncStorage.getItem("timers")) || "[]");
    existingTimers.push(newTimer);
    await AsyncStorage.setItem("timers", JSON.stringify(existingTimers));
    router.push("/");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212',
    },
    text: {
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'light' ? "#ccc" : "#444",
      padding: 5,
      marginBottom: 10,
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#2a2a2a',
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Timer Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.text}>Duration (seconds):</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" />
      <Text style={styles.text}>Category:</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Halfway Alert:</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} />
      </View>
      <Button title="Save Timer" onPress={saveTimer} />
    </View>
  );
}