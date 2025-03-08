import React, { useEffect, useState } from "react";
import { View, Text,Modal, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity, Animated, Easing } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const LaunchDetailsScreen = ({ route }) => {
  const { launch } = route.params;
  const [rocket, setRocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation for fade in effect
  const [launchpad, setLaunchpad] = useState(null);
  const [loadingLaunchpad, setLoadingLaunchpad] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
const [launchModalVisible, setLaunchModalVisible] = useState(false);  

const [payload, setPayload] = useState(null);
const [loadingPayload, setLoadingPayload] = useState(true);
const [payloadModalVisible, setPayloadModalVisible] = useState(false);
  const insets = useSafeAreaInsets(); 
  useEffect(() => {
    
    const fetchLaunchpadDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spacexdata.com/v4/launchpads/${launch.launchpad}`
        );
        setLaunchpad(response.data);
      } catch (error) {
        console.error("Error fetching launchpad details:", error);
      } finally {
        setLoadingLaunchpad(false);
      }
    };
  
    fetchLaunchpadDetails();
  }, [launch.launchpad]);
  
  useEffect(() => {
    const fetchRocketDetails = async () => {
      try {
        const response = await axios.get(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`);
        setRocket(response.data);
      } catch (error) {
        console.error("Error fetching rocket details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRocketDetails();
  }, [launch.rocket]);

  useEffect(() => {
    if (rocket) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [rocket, navigation]);
  useEffect(() => {
    const fetchPayloadDetails = async () => {
      try {
        if (launch.payloads.length > 0) {
          const response = await axios.get(
            `https://api.spacexdata.com/v4/payloads/${launch.payloads[0]}`
          );
          setPayload(response.data);
        }
      } catch (error) {
        console.error("Error fetching payload details:", error);
      } finally {
        setLoadingPayload(false);
      }
    };
  
    fetchPayloadDetails();
  }, [launch.payloads]);
  useEffect(() => {
    
    if (!loading && rocket) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true, 
      }).start();
    }
  }, [loading, rocket]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {launch.name} | {rocket ? rocket.name : ''}
        </Text>
      </View>

      <ScrollView 
        style={[styles.content, { paddingBottom: insets.bottom }]}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Image Below Header */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/images/responsive_large_M6WwUWq0RPC7_MW5n6s81wgynwMAkV1RKeJfawkhDDo.jpg')} 
            style={styles.missionPatch} 
          />
        </View>

        <Text style={styles.sectionTitle}>ROCKET DETAILS</Text>

        {loading ? (
  <ActivityIndicator size="large" color="#00ff00" />
) : rocket ? (
  <View style={styles.rocketHeader}>
    <Text style={styles.rocketName}>{rocket.name}</Text>
    <TouchableOpacity style={styles.viewDetailsButton} onPress={() => setModalVisible(true)}>
      <Text style={styles.viewDetailsText}>View Details</Text>
    </TouchableOpacity>
  </View>
) : (
  <Text style={styles.errorText}>Rocket details not available</Text>
)}{rocket && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{rocket.name} Details</Text>

        {/* Two-column layout*/}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>First Flight</Text>
            <Text style={styles.cardInfo}>
              {rocket.first_flight || "Not available"}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Engines</Text>
            <Text style={styles.cardInfo}>
              {rocket.engines?.number} ({rocket.engines?.type})
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Height</Text>
            <Text style={styles.cardInfo}>
              {rocket.height?.meters} meters
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Diameter</Text>
            <Text style={styles.cardInfo}>
              {rocket.diameter?.meters} meters
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Thrust</Text>
            <Text style={styles.cardInfo}>
              {rocket.engines?.thrust_vacuum?.kN} kN
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Stages</Text>
            <Text style={styles.cardInfo}>
              {rocket.stages || "Not available"}
            </Text>
          </View>
        </View>

        {/* Description section  */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.cardInfo}>
            {rocket.description || "Description not available"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}
<Text style={styles.sectionTitle}>LAUNCH SITE</Text>

{loadingLaunchpad ? (
  <ActivityIndicator size="large" color="#00ff00" />
) : launchpad ? (
<View style={styles.launchHeader}>
  <Text style={styles.launchName} numberOfLines={1} ellipsizeMode="tail">
    {launchpad.full_name}
  </Text>
  <TouchableOpacity style={styles.viewDetailsButtonlaunch} onPress={() => setLaunchModalVisible(true)}>
    <Text style={styles.viewDetailsText}>View Details</Text>
  </TouchableOpacity>
</View>


) : (
  <Text style={styles.errorText}>Launch site details not available</Text>
)}


{/* Launch Site Details Modal */}
{launchpad && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={launchModalVisible}
    onRequestClose={() => setLaunchModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{launchpad.full_name} Details</Text>

        {/* Two-column layout for details */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Location</Text>
            <Text style={styles.cardInfo}>
              {launchpad.location ? `${launchpad.location.name}, ${launchpad.location.region}` : "Not available"}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Status</Text>
            <Text style={styles.cardInfo}>{launchpad.status}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Latitude</Text>
            <Text style={styles.cardInfo}>{launchpad.latitude}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Longitude</Text>
            <Text style={styles.cardInfo}>{launchpad.longitude}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setLaunchModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}
<Text style={styles.sectionTitle}>PAYLOAD</Text>

{loadingPayload ? (
  <ActivityIndicator size="large" color="#00ff00" />
) : payload ? (
  <View style={styles.payloadHeader}>
    <Text style={styles.payloadName} numberOfLines={1} ellipsizeMode="tail">
      {payload.name}
    </Text>
    <TouchableOpacity style={styles.viewDetailsButtonlaunch} onPress={() => setPayloadModalVisible(true)}>
      <Text style={styles.viewDetailsText}>View Details</Text>
    </TouchableOpacity>
  </View>
) : (
  <Text style={styles.errorText}>Payload details not available</Text>
)}

{payload && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={payloadModalVisible}
    onRequestClose={() => setPayloadModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{payload.name} Details</Text>

        {/* Two-column layout for payload details */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Type</Text>
            <Text style={styles.cardInfo}>{payload.type || "Not available"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Mass</Text>
            <Text style={styles.cardInfo}>
              {payload.mass_kg ? `${payload.mass_kg} kg` : "Not available"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Orbit</Text>
            <Text style={styles.cardInfo}>{payload.orbit || "Not available"}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.cardTitle}>Manufacturer</Text>
            <Text style={styles.cardInfo}>{payload.manufacturers?.join(", ") || "Unknown"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={() => setPayloadModalVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}<View style={styles.imageContainer}>
{launch.links.patch && launch.links.patch.small ? (
  <Image 
    source={{ uri: launch.links.patch.small }} 
    style={styles.missionPatch} 
    resizeMode="contain"
  />
) : (
  <Text style={styles.errorText}>No mission patch available</Text>
)}
</View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#121212",
  },
  customHeader: {
    backgroundColor: "#1e1e1e",
    width: '100%',
    height: 90, 
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },missionPatch: {
    width: 120,  
    height: 120,  
    alignSelf: "center",
    marginBottom: 10,
  },
  
  backButton: {
    position: 'absolute',
    left: 15,
    top: 39,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    left: 10,
    fontFamily: "Poppins-Bold",
    top: 3,
  },
  payloadHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  
  payloadName: {
    flex: 0.7,
    fontSize: 18,
    // fontWeight: "bold",
    fontFamily:"Poppins-Medium",
    color: "#fff",
    marginRight: 10,
    overflow: "hidden",
    left:17
  },
  
  content: {
    marginTop: 55, 
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, 
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  missionPatch: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#ffcc00",
    marginTop: 17,
    paddingLeft: 10,
    fontFamily: "Roboto",
    fontStyle:"bold"
  },
  cardContainer: {
    marginTop: 20,
    
  },
  cardTitle: {
    fontSize: 17,
    color: "yellow",
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
  },
  cardInfo: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 22,
    fontFamily: 'Poppins-Medium',
  },
  errorText: { fontSize: 16,
     color: "red",
    textAlign:"center"},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 16,
    // fontWeight: "bold",
        fontFamily:"Poppins-Medium",

    color: "#93def6",
  },
  cardInfo: {
    fontSize: 14,
    color: "#f8fdff",
        fontFamily:"Poppins-Medium"

  },
  descriptionContainer: {
    marginTop: 10,
    fontFamily:"Poppins-Medium"

  },
  rocketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#121212",
    borderRadius: 10,
  },
  
  rocketName: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#fff",
    fontFamily:"Poppins-Medium"
  },
  launchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginVertical: 10,
  },
  
  launchName: {
    flex: 0.7, 
    fontSize: 18,
    // fontWeight: "bold",
    fontFamily:"Poppins-Medium",
    color: "#fff",
    marginRight: 10, // Adds spacing before button
    overflow: "hidden", // Prevents text overflow
    left:15
  },
  viewDetailsButtonlaunch:{ backgroundColor: "#233947",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  right:18},

  
  viewDetailsButton: {
    backgroundColor: "#233947",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },

  viewDetailsText: {
    color: "#fff",
    fontSize: 14,
    // fontWeight: "bold",
    fontFamily:"Poppins-Medium"
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    fontFamily:"Poppins-Medium"

  },
  
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    fontFamily:"Poppins-Medium"
  },
  
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  
  closeButton: {
    marginTop: 20,
    backgroundColor: "#93def6",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  
  closeButtonText: {
    color: "black",
    fontSize: 16,
    // fontWeight: "bold",
    fontFamily:"Poppins-Medium"
  },
  
});

export default LaunchDetailsScreen;
