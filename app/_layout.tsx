import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="add-timer" options={{ title: "Add Timer" }} />
      <Stack.Screen name="edit-timer" options={{ title: "Edit Timer" }} />
    </Stack>
  );
}
