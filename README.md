# Welcome to your Expo app 👋

# React Native Timer App

A versatile timer application built with React Native and Expo, featuring customizable timers, categories, and theme switching.

## Features

- Create and manage multiple timers
- Organize timers by categories
- Dark and light theme support
- Halfway alerts for timers
- Bulk actions for timers within categories
- Timer history tracking
- Export timer data as .txt

## Installation

1. Clone the repository:

git clone https://github.com/yourusername/react-native-timer-app.git 

cd react-native-timer-app


2. Install dependencies:

npm install

## This App is build only for Android, since I don't own a Mac hence couldn't test it for Iphones.


3. If you encounter any issues with the installation, try the following:

npm cache clean --force rm -rf node_modules npm install


## Running the App

This app uses Expo Router. To start the development server:

npx expo start


This will open the Expo DevTools in your browser. You can then run the app on:
- An iOS simulator
- An Android emulator
- Your physical device using the Expo Go app

## Building the App

To build the app for production:

1. Configure the build:

eas build:configure


2. Build for both platforms:

eas build --platform android

3. Run the App:

npm expo start




## Project Structure

- `app/`: Contains the main application code
- `index.tsx`: Home screen and main timer functionality
- `add-timer.tsx`: Screen for adding new timers
- `edit-timer.tsx`: Screen for editing existing timers
- `history.tsx`: Screen for viewing timer history
- `theme-context.tsx`: Theme context for managing app-wide theme
- `eas.json`: EAS Build configuration

## Dependencies

- React Native
- Expo
- Expo Router
- AsyncStorage for data persistence
- ... (list other major dependencies)
