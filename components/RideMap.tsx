import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const RideMap = () => {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const { selectedDriver, setDrivers } = useDriverStore();
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Generate driver markers once data is loaded
  useEffect(() => {
    if (!userLatitude || !userLongitude || !Array.isArray(drivers)) return;

    const generated = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });

    setMarkers(generated);
  }, [drivers, userLatitude, userLongitude]);

  // Update driver times if route is selected
  useEffect(() => {
    if (
      markers.length &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((updatedDrivers) => {
        setDrivers(updatedDrivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  if (loading || (!userLatitude && !userLongitude)) {
    return (
      <View className="w-full flex items-center justify-center py-4">
        <ActivityIndicator size="small" color="#0286FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full flex items-center justify-center py-4">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation
          showsPointsOfInterest={false}
          initialRegion={region}
          userInterfaceStyle="light"
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              image={
                selectedDriver === marker.id
                  ? icons.selectedMarker
                  : icons.marker
              }
            />
          ))}

          {destinationLatitude && destinationLongitude && (
            <>
              <Marker
                key="destination"
                coordinate={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                title="Destination"
                image={icons.pinEmerald}
              />
              <MapViewDirections
                origin={{ latitude: userLatitude!, longitude: userLongitude! }}
                destination={{
                  latitude: destinationLatitude,
                  longitude: destinationLongitude,
                }}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
                strokeColor="#10B981" // Emerald shade
                strokeWidth={3}
              />
            </>
          )}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default RideMap;
