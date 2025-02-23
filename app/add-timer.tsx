import React, { useState } from "react";
import { View, Text, TextInput, Button, Switch, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTimerScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const saveTimer = async () => {
    if (!name || !duration || !category) return;
    const newTimer = {
      name: `\${name}_\${Date.now()}`, // Ensure unique name
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

  return (
    <View style={styles.container}>
      <Text>Timer Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Duration (seconds):</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" />
      <Text>Category:</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />
      <View style={styles.switchContainer}>
        <Text>Halfway Alert:</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} />
      </View>
      <Button title="Save Timer" onPress={saveTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});