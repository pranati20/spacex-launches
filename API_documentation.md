# API Documentation for SpaceX Launch App

## Overview

This document describes the APIs used in the SpaceX Launch App, which fetches details about launches, rockets, and launchpads from the SpaceX API.

## Base URL

The application interacts with the SpaceX API:

```
https://api.spacexdata.com/v4/
```

## Endpoints Used

### 1. Fetch All Launches

- **Endpoint:** `/launches`
- **Method:** `GET`
- **Description:** Retrieves a list of all SpaceX launches.
- **Example Request:**
  ```http
  GET https://api.spacexdata.com/v4/launches
  ```
- **Example Response:**
  ```json
  [
    {
      "id": "5eb87d4effd86e000604b388",
      "name": "FalconSat",
      "date_utc": "2006-03-24T22:30:00.000Z",
      "rocket": "5e9d0d95eda69955f709d1eb",
      "launchpad": "5e9e4501f509094ba4566f84"
    }
  ]
  ```

### 2. Fetch Rocket Details

- **Endpoint:** `/rockets/{id}`
- **Method:** `GET`
- **Description:** Retrieves details of a specific rocket used in a launch.
- **Example Request:**
  ```http
  GET https://api.spacexdata.com/v4/rockets/5e9d0d95eda69955f709d1eb
  ```
- **Example Response:**
  ```json
  {
    "id": "5e9d0d95eda69955f709d1eb",
    "name": "Falcon 1",
    "first_flight": "2006-03-24",
    "height": { "meters": 22.25 },
    "diameter": { "meters": 1.68 },
    "stages": 2,
    "description": "Falcon 1 was the first privately developed liquid-fueled rocket..."
  }
  ```

### 3. Fetch Launchpad Details

- **Endpoint:** `/launchpads/{id}`
- **Method:** `GET`
- **Description:** Retrieves details of a launchpad used for a launch.
- **Example Request:**
  ```http
  GET https://api.spacexdata.com/v4/launchpads/5e9e4501f509094ba4566f84
  ```
- **Example Response:**
  ```json
  {
    "id": "5e9e4501f509094ba4566f84",
    "name": "Kwajalein Atoll",
    "region": "Marshall Islands",
    "latitude": 9.0477,
    "longitude": 167.7431,
    "status": "retired"
  }
  ```

## API Usage in the App

The app fetches launches and then makes additional API calls for each launch to get the respective rocket and launchpad details.

### Code Implementation

```javascript
useEffect(() => {
  const fetchLaunches = async () => {
    try {
      const response = await axios.get("https://api.spacexdata.com/v4/launches");
      const launchesWithRockets = await Promise.all(
        response.data.reverse().map(async (launch) => {
          const rocketResponse = await axios.get(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`);
          return { ...launch, rocketName: rocketResponse.data.name };
        })
      );
      setLaunches(launchesWithRockets);
      setFilteredLaunches(launchesWithRockets);
    } catch (error) {
      console.error("Error fetching launches:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchLaunches();
}, []);
```

## Conclusion

This app relies entirely on the SpaceX API to fetch real-time data about launches, rockets, and launchpads. No additional backend is used.

