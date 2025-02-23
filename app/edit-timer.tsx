import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Timer = {
  name: string;
  duration: number;
  remaining: number;
  category: string;
  status: "Pending" | "Running" | "Paused" | "Completed";
};

export default function EditTimerScreen() {
  const { timer: timerString } = useLocalSearchParams<{ timer: string }>();
  const router = useRouter();
  const [timer, setTimer] = useState<Timer | null>(null);
  const [originalName, setOriginalName] = useState<string>('');
  const [originalCategory, setOriginalCategory] = useState<string>('');

  useEffect(() => {
    if (timerString) {
      const parsedTimer = JSON.parse(timerString);
      setTimer(parsedTimer);
      setOriginalName(parsedTimer.name);
      setOriginalCategory(parsedTimer.category);
    }
  }, [timerString]);

  const handleSave = async () => {
    if (timer) {
      if (!timer.name || !timer.category || timer.duration <= 0) {
        Alert.alert("Invalid Input", "Please ensure all fields are filled and duration is greater than 0.");
        return;
      }

      const timers = JSON.parse(await AsyncStorage.getItem('timers') || '[]');
      let updatedTimers = timers.filter((t: Timer) => !(t.name === originalName && t.category === originalCategory));
      
      updatedTimers.push({
        ...timer,
        remaining: timer.status === "Running" ? timer.remaining : timer.duration
      });

      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      router.back();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!timer) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Timer</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Timer Name:</Text>
        <TextInput
          style={styles.input}
          value={timer.name}
          onChangeText={(text) => setTimer({ ...timer, name: text })}
          placeholder="Timer Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Duration (seconds):</Text>
        <TextInput
          style={styles.input}
          value={timer.duration.toString()}
          onChangeText={(text) => {
            const duration = parseInt(text) || 0;
            setTimer({ ...timer, duration, remaining: timer.status === "Running" ? timer.remaining : duration });
          }}
          placeholder="Duration (seconds)"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category:</Text>
        <TextInput
          style={styles.input}
          value={timer.category}
          onChangeText={(text) => setTimer({ ...timer, category: text })}
          placeholder="Category"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSave} />
        <Button title="Cancel" onPress={handleCancel} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});