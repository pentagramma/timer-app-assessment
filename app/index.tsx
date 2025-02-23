import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Modal, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Timer = {
  name: string;
  duration: number;
  remaining: number;
  category: string;
  status: "Pending" | "Running" | "Paused" | "Completed";
};

export default function HomeScreen() {
  const router = useRouter();
  const [timers, setTimers] = useState<Timer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
  const [editingTimer, setEditingTimer] = useState<string | null>(null);

  useEffect(() => {
    loadTimers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRunningTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, [timers]);


  const updateTimers = async (updatedTimers: Timer[]) => {
    setTimers(updatedTimers);
    await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
  };

  const updateRunningTimers = () => {
    setTimers(prevTimers =>
      prevTimers.map(timer => {
        if (timer.status === "Running" && timer.remaining > 0) {
          const newRemaining = timer.remaining - 1;
          if (newRemaining === 0) {
            setCompletedTimer(timer);
            saveCompletedTimer(timer);
            return { ...timer, remaining: 0, status: "Completed" };
          }
          return { ...timer, remaining: newRemaining };
        }
        return timer;
      })
    );
  };
  
  const saveCompletedTimer = async (timer: Timer) => {
    const completedTimers = JSON.parse(await AsyncStorage.getItem("completedTimers") || "[]");
    completedTimers.push({
      name: timer.name,
      completionTime: new Date().toISOString(),
    });
    await AsyncStorage.setItem("completedTimers", JSON.stringify(completedTimers));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const startTimer = (timerName: string, category: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.name === timerName && timer.category === category 
        ? { ...timer, status: "Running" } 
        : timer
    ));
  };

  const pauseTimer = (timerName: string, category: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.name === timerName && timer.category === category 
        ? { ...timer, status: "Paused" } 
        : timer
    ));
  };

  const resetTimer = (timerName: string, category: string) => {
    setTimers(prevTimers => prevTimers.map(timer => 
      timer.name === timerName && timer.category === category 
        ? { ...timer, remaining: timer.duration, status: "Pending" } 
        : timer
    ));
  };

  const bulkAction = (category: string, action: "start" | "pause" | "reset") => {
    const updatedTimers = timers.map((timer) => {
      if (timer.category === category) {
        switch (action) {
          case "start":
            return { ...timer, status: "Running" as const };
          case "pause":
            return { ...timer, status: "Paused" as const };
          case "reset":
            return { ...timer, remaining: timer.duration, status: "Pending" as const };
        }
      }
      return timer;
    });
    updateTimers(updatedTimers);
  };

  const editTimer = (timer: Timer) => {
    router.push({
      pathname: "/edit-timer",
      params: { timer: JSON.stringify(timer) },
    });
    
  };
  
  const deleteTimer = (timerName: string, category: string) => {
    Alert.alert(
      "Delete Timer",
      `Are you sure you want to delete "\${timerName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const updatedTimers = timers.filter(
              timer => !(timer.name === timerName && timer.category === category)
            );
            setTimers(updatedTimers);
            await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
          }
        },
      ]
    );
  };

  const loadTimers = async () => {
    const savedTimers = await AsyncStorage.getItem("timers");
    if (savedTimers) {
      const parsedTimers = JSON.parse(savedTimers) as Timer[];
      setTimers(parsedTimers);
      updateCategories(parsedTimers);
    } else {
      setTimers([]);
      setCategories([]);
    }
  };

  const updateCategories = (timers: Timer[]) => {
    const newCategories = [...new Set(timers.map((t) => t.category))];
    setCategories(newCategories);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateRunningTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTimers();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Button title="Add Timer" onPress={() => router.push("/add-timer")}  />
      <Button title="View History" onPress={() => router.push("/history")} />
      {categories.map((category) => (
        <View key={category} style={styles.categoryContainer}>
          <Button title={category} onPress={() => toggleCategory(category)} />
          <View style={styles.bulkActionContainer}>
            <Button
              title="Start All"
              onPress={() => bulkAction(category, "start")}
            />
            <Button
              title="Pause All"
              onPress={() => bulkAction(category, "pause")}
            />
            <Button
              title="Reset All"
              onPress={() => bulkAction(category, "reset")}
            />
          </View>
          {expandedCategories.includes(category) &&
            timers
              .filter((timer) => timer.category === category)
              .map((timer, index) => (
                <View key={index} style={styles.timerContainer}>
                  <Text>{timer.name}</Text>
                  <Text>Remaining Time: {timer.remaining}s</Text>
                  <Text>Status: {timer.status}</Text>
                  <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      {
                        width: `\${Math.max(0, Math.min(100, (timer.remaining / timer.duration) * 100))}%`,
                      },
                    ]}
                  />
                  </View>
                  <View style={styles.buttonContainer}>
                  <Button
                      title="Start"
                      onPress={() => startTimer(timer.name, timer.category)}
                      disabled={timer.status === "Running"}
                    />
                    <Button
                      title="Pause"
                      onPress={() => pauseTimer(timer.name, timer.category)}
                      disabled={timer.status !== "Running"}
                    />
                    <Button title="Reset" onPress={() => resetTimer(timer.name, timer.category)} />

                  </View>
                  <View style={styles.editDeleteContainer}>
                    <Button 
                      title="Edit" 
                      onPress={() => editTimer(timer)} 
                    />
                    <Button 
                      title="Delete" 
                      onPress={() => deleteTimer(timer.name, timer.category)}
                      color="red"
                    />
                  </View>
                </View>
              ))}
        </View>
      ))}
      <Modal
        visible={!!completedTimer}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Congratulations! {completedTimer?.name} is completed!
            </Text>
            <Button
              title="OK"
              onPress={() => setCompletedTimer(null)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categoryContainer: {
    marginVertical: 10,
  },
  bulkActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  timerContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  editDeleteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});