# SpaceX Launch App

## Overview

The SpaceX Launch App is a React Native application that fetches and displays details about SpaceX launches, rockets, and launch sites using the SpaceX API.

## Features
- View upcoming and past SpaceX launches.
- Fetch detailed rocket information.
- Display launchpad details.
- Animated splash screen.
- Smooth navigation with custom transitions.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/spacex-launch-app.git
   ```

2. Navigate into the project directory:
   ```sh
   cd spacex-launch-app
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Start the development server:
   ```sh
   expo start
   ```

## API Usage

This app fetches data from the SpaceX API:
- **Launches:** `https://api.spacexdata.com/v4/launches`
- **Rockets:** `https://api.spacexdata.com/v4/rockets/{id}`
- **Launchpads:** `https://api.spacexdata.com/v4/launchpads/{id}`

For more details, check the [API Documentation](./Api%20Documentation.md).

## Building the APK

To generate an APK, run:
```sh
eas build -p android --profile preview
```

Ensure you have an `eas.json` file configured correctly.

## Dependencies
- React Native
- Expo
- Axios (for API calls)
- React Navigation
- Lottie (for animations)

## Contributing

Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the MIT License.

