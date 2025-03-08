# SpaceX Launch App

## Overview
The SpaceX Launch App allows users to view upcoming and past SpaceX launches, along with detailed information about rockets and launchpads.

## Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/pranati20/spacex-launches.git
   ```
2. **Navigate to the project folder:**
   ```sh
   cd spacex-launches
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Run the project:**
   ```sh
   expo start
   ```
5. **Build an APK (optional):**
   ```sh
   eas build -p android --profile preview
   ```

## Features Implemented
- Fetches and displays upcoming and past SpaceX launches.
- Detailed information on each launch, including the rocket and launchpad used.
- View additional details on rockets (height, diameter, thrust, etc.) via a modal popup.
- View detailed launch site information in a structured format.
- Search functionality to filter launches by name.
- Custom animated splash screen for an enhanced user experience.
- Dark-themed UI with a modern design.

## Technologies Used
- **React Native**: For building the mobile application.
- **Expo**: For rapid development and testing.
- **Axios**: For making API requests.
- **SpaceX API**: To fetch real-time data.
- **Lottie Animations**: Used for splash screen animations.
- **React Navigation**: For managing app navigation.
- **React Native Safe Area Context**: To handle safe area insets.

## Challenges Faced & Solutions
1. **Handling API Data with Multiple Requests:**
   - The SpaceX API provides launch details separately from rocket and launchpad details.
   - **Solution:** Used `Promise.all` to fetch additional details for each launch efficiently.

2. **Splash Screen Delay & Expo's Default Splash:**
   - Expo shows its own splash before loading our animation.
   - **Solution:** Used `SplashScreen.preventAutoHideAsync()` to delay Expo's splash until the app is ready.

3. **Handling Large Launch Site Names in UI:**
   - Some launch site names were too long, affecting the layout.
   - **Solution:** Used ellipsis (`...`) after a character limit and displayed full details in a modal.

4. **Expo Firebase Deprecation:**
   - Expo's built-in Firebase modules are deprecated.
   - **Solution:** Transitioned to `react-native-firebase` where needed.

## Future Improvements
- Implement offline caching for previously fetched launch data.
- Add a favorite launches feature for quick access to specific launches.
- Include real-time countdown timers for upcoming launches.
- Implement push notifications for upcoming launches.
- Improve performance with better API request handling and caching strategies.

## Conclusion
This app provides an interactive and informative way to explore SpaceX launches using real-time data. Future iterations will include more features to enhance user engagement and accessibility.

