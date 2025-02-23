import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "./theme-context";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="history" options={{ title: "History" }} />
        <Stack.Screen name="add-timer" options={{ title: "Add Timer" }} />
        <Stack.Screen name="edit-timer" options={{ title: "Edit Timer" }} />
      </Stack>
    </ThemeProvider>
  );
}