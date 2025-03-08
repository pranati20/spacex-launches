import React, { useEffect, useState } from "react";
import { View,TouchableWithoutFeedback, Keyboard, Text, TextInput,FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import Icon from 'react-native-vector-icons/FontAwesome'; 

const LaunchListScreen = () => {
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const navigation = useNavigation();
  const [filter, setFilter] = useState("All"); // Track the current filter (All, Upcoming, Past)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track visibility of dropdown
  const [selectedYear, setSelectedYear] = useState(null); // Track the selected year
  const [years, setYears] = useState([]); // List of years in the selected decade
  const [selectedDecade, setSelectedDecade] = useState(null);

  const [buttonLayouts, setButtonLayouts] = useState({});

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await axios.get("https://api.spacexdata.com/v4/launches");
        // console.log(response.data); 

        // Fetch rocket details for each launch
        const launchesWithRockets = await Promise.all(
          response.data.reverse().map(async (launch) => {
            const rocketResponse = await axios.get(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`);
            return { ...launch, rocketName: rocketResponse.data.name };
          })
        );

        setLaunches(launchesWithRockets);
        setFilteredLaunches(launchesWithRockets); // Set filtered launches initially

      } catch (error) {
        console.error("Error fetching launches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);
  const handleSearch = (text) => {
    setSearchQuery(text);
  
    // Filter launches based on both rocket name and launch name (case insensitive)
    const filteredData = launches.filter((launch) =>
      launch.rocketName.toLowerCase().includes(text.toLowerCase()) ||
      launch.name.toLowerCase().includes(text.toLowerCase()) // Added filtering by launch name
    );
    setFilteredLaunches(filteredData); 
  };
  const handleFilter = (filterType) => {
    setFilter(filterType);
    
    let filteredData;
    if (filterType === "Upcoming") {
      filteredData = launches.filter((launch) => launch.upcoming);
    } else if (filterType === "Past") {
      filteredData = launches.filter((launch) => !launch.upcoming);
    } else if (filterType === "2020s") {
      filteredData = launches.filter((launch) => {
        const launchYear = new Date(launch.date_utc).getFullYear();
        return launchYear >= 2020 && launchYear < 2030;
      });
    } else if (filterType === "2010s") {
      filteredData = launches.filter((launch) => {
        const launchYear = new Date(launch.date_utc).getFullYear();
        return launchYear >= 2010 && launchYear < 2020;
      });
    } else if (filterType === "2000s") {
      filteredData = launches.filter((launch) => {
        const launchYear = new Date(launch.date_utc).getFullYear();
        return launchYear >= 2000 && launchYear < 2010;
      });
    } else {
      filteredData = launches; // All launches
    }

    filteredData = filteredData.filter((launch) =>
      launch.rocketName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      launch.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    setFilteredLaunches(filteredData);
};

  const handleYearButtonClick = (decade) => {
    setIsDropdownVisible(!isDropdownVisible);
    const startYear = decade;
    const endYear = decade + 9;
    const decadeYears = [];
    for (let year = startYear; year <= endYear; year++) {
      decadeYears.push(year);
    }
    setYears(decadeYears); // Set the years for the selected decade
    setSelectedDecade(decade);
};
const handleYearSelect = (year) => {
  setSelectedYear(year);
  setIsDropdownVisible(false); // Close dropdown after selection

  const filteredByYear = launches.filter((launch) => {
    const launchYear = new Date(launch.date_utc).getFullYear();
    return launchYear === year;
  });

  setFilteredLaunches(filteredByYear); // Update filtered launches based on selected year
};


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("LaunchDetails", { launch: item })}
      >
        {/* Logo container on the left */}
        <View style={styles.logoContainer}>
          <Icon name="rocket" size={30} color="#3498db" />
        </View>
  
        {/* Details section beside the logo */}
        <View style={styles.detailsContainer}>
          <Text style={styles.missionName}>{item.name}</Text>
          <Text style={styles.date}>{new Date(item.date_utc).toDateString()}</Text>
          <Text style={styles.rocket}>{item.rocketName}</Text>
          <View style={styles.statusBadge(item.success)}>
            <Text style={styles.statusText}>
              {item.upcoming ? "Upcoming" : item.success ? "Success" : "Failed"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
    <View style={styles.container}>
      {/* Ionicon and Title */}
      <View style={styles.headerContainer}>
        <Ionicons name="rocket-outline" size={32} color="#f8fdff" />
        
        <Text style={styles.headerText}>SpaceX Launches</Text>
      </View>
      <View style={styles.searchContainer}>

      {/* Search Bar */}

      <TextInput
        style={styles.searchInput}
        placeholder="Search for Launches..."
        placeholderTextColor="#bbbbbb"
        value={searchQuery}
        onChangeText={handleSearch}
      />      <Ionicons name="search" size={22} color="#bbbbbb" style={styles.searchIcon} />
</View>
<View style={styles.filterContainer}>
<TouchableOpacity
    style={[styles.filterButton, filter === "All" && styles.activeFilter]}
    onPress={() => handleFilter("All")}
  >
    <Text style={styles.filterText}>All</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.filterButton, filter === "Upcoming" && styles.activeFilter]}
    onPress={() => handleFilter("Upcoming")}
  >
    <Text style={styles.filterText}>Upcoming</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.filterButton, filter === "Past" && styles.activeFilter]}
    onPress={() => handleFilter("Past")}
  >
    <Text style={styles.filterText}>Past</Text>
  </TouchableOpacity>
  
</View>
<View style={styles.filterContainer}>
  

  {/* Decade Year Dropdown Button */}
  <TouchableOpacity
  style={[styles.filterButton]}
  onPress={() => handleYearButtonClick(2020)} 
  onLayout={(event) => {
    const layout = event.nativeEvent.layout;
    setButtonLayouts((prev) => ({ ...prev, 2020: layout })); 
  }}
>
  <View style={styles.yearContainer}>
    <Text style={styles.filterText}>2020s</Text>
    <Ionicons name="caret-down" size={16} color="#fff" />
  </View>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.filterButton]}
  onPress={() => handleYearButtonClick(2010)}
  onLayout={(event) => {
    const layout = event.nativeEvent.layout;
    setButtonLayouts((prev) => ({ ...prev, 2010: layout })); 
  }}
>
  <View style={styles.yearContainer}>
    <Text style={styles.filterText}>2010s</Text>
    <Ionicons name="caret-down" size={16} color="#fff" />
  </View>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.filterButton]}
  onPress={() => handleYearButtonClick(2000)} 
  onLayout={(event) => {
    const layout = event.nativeEvent.layout;
    setButtonLayouts((prev) => ({ ...prev, 2000: layout })); 
  }}
>
  <View style={styles.yearContainer}>
    <Text style={styles.filterText}>2000s</Text>
    <Ionicons name="caret-down" size={16} color="#fff" />
  </View>
</TouchableOpacity>


  
  
  {/* Display the dropdown */}
  {isDropdownVisible && (
  <View
    style={[
      styles.dropdown,
      buttonLayouts[selectedDecade] && {
        top: buttonLayouts[selectedDecade].y + buttonLayouts[selectedDecade].height,
        left: buttonLayouts[selectedDecade].x,
      },
    ]}
  >
    {years.map((year) => (
      <TouchableOpacity key={year} onPress={() => handleYearSelect(year)}>
        <Text style={styles.dropdownItem}>{year}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

</View>



      {loading ? (
        <ActivityIndicator size="large" color="#ffcc00" />
      ) : (
        <FlatList
          data={filteredLaunches}
          keyExtractor={(item) => item.id}

          renderItem={renderItem}
        />
      )}
    </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12191f", padding: 10 },
  yearContainer: {
    flexDirection: 'row',  
    alignItems: 'center', 
  },
  headerContainer: { 
    flexDirection: "container", 
    alignItems: "left", 
    marginBottom: 20, 
    justifyContent: "left" ,
    top:30,
    gap:4
  },
  headerText: { 
    fontSize: 24, 
    // fontWeight: "bold", 
    color: "white", 
    marginLeft: 2 ,
    fontFamily:"Poppins-Bold"
  },
  card: {
    flexDirection: "row", 
    backgroundColor: "#12191f", 
    borderRadius: 10, 
    padding: 10, 
    marginVertical: 8, 
    alignItems: "center", 
    position: "relative",

  },
  logoContainer: {
    width: 50, 
    height: 50,
    borderRadius: 10, 
    backgroundColor: "#233947", 
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    marginLeft: 15,
    flex: 1, 
  },
  missionName: {
    fontSize: 16, 
    color: "#ffffff", 
    fontFamily: "Poppins-Medium",
    marginBottom:-10
  },
  date: {
    fontSize: 14,
    color: "#bbbbbb", 
    marginTop: 4,
    fontFamily: "Poppins-Medium",
    marginBottom:-10

  },
  rocket: {
    fontSize: 14,
    color: "#bbbcc9", 
    marginTop: 4,
    fontFamily: "Poppins-Medium"
  },
  
  statusBadge: (success) => ({
    backgroundColor: success === null ? "#ffcc00" : success ? "#00aa00" : "#ff4444",
    padding: 5,
    borderRadius: 5,
    position: "absolute",
    top: 10, 
    right: 10, 
  }),
  statusText: {
    fontSize: 12, 
    color: "#fff",
    fontFamily: "Poppins-Medium"
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: "relative", 
  },
  searchInput: {
    height: 47,
    borderColor: "#233947",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 35,
    marginBottom: 25,
    color: "#ffffff",
    top: 20,
    backgroundColor: "#233947",
    flex: 1, 
    fontFamily:"Poppins-Medium"
  },
  searchIcon: {
    position: "absolute", 
    left: 8,
    bottom:19
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", 
    marginVertical: 6,
    gap: 8,  
    alignItems: "center",
  },
  
  filterButton: {
    backgroundColor: "#233947",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 15,
    alignItems: "center",  // Center text horizontally within the button
  },
  
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  
  activeFilter: {
    backgroundColor: "#ffcc00", 
  },leftSection: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 10, 
    backgroundColor:"black"  },
  rocketIcon: {
    marginRight: 10,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    backgroundColor: "#233947",
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
    width: 120,
  },
  dropdownItem: {
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  
  
});

export default LaunchListScreen;
