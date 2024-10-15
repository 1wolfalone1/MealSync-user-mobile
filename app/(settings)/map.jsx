import * as Location from 'expo-location';
import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Button, Divider, IconButton } from 'react-native-paper';
import uuid from 'react-native-uuid';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../constant';
import globalSlice, { globalSelector } from '../../redux/slice/globalSlice';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  shadow: {
    shadowOffset: { width: 5, height: 8 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.7,
    elevation: 10,
  },
});

const Map = () => {
  const refSuggest = useRef();
  const refMap = useRef();
  const refMarker = useRef();
  const dispatch = useDispatch();
  const { map } = useSelector(globalSelector);
  const [margin, setMargin] = useState({
    marginBottom: 1,
  });
  const [origin, setOrigin] = useState([
    {
      latitude: 10.8387911,
      longitude: 106.8347649,
      name: 'Vinhome Grand Park',
    },
  ]);
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
    if (refSuggest) {
      if (map.origin) {
        refSuggest.current.setAddressText(map.origin.name);
        setOrigin([
          {
            latitude: map.origin.latitude,
            longitude: map.origin.longitude,
            name: map.origin.name,
          },
        ]);
      }
      if (refSuggest.current) {
        refSuggest?.current?.setAddressText(map.origin.name);
      }
    }
    if (refMarker?.current) {
      refMarker.current.showCallout();
    }
  }, []);
  const apiKey = process.env.EXPO_PUBLIC_SERVICE_API;

  const handleSaveAddress = () => {
    dispatch(
      globalSlice.actions.changeMapState({
        latitude: origin[0].latitude,
        longitude: origin[0].longitude,
        name: origin[0].name,
      }),
    );
    router.back();
  };
  return (
    <View
      className="flex-1 bg-white"
      contentContainerStyle={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <View className="flex-1  px-2 pb-8 mt-4">
        <View className="items-center flex-row justify-center gap-2">
          <Text className="font-hnow64regular text-lg text-primary">
            Chọn địa chỉ tòa của bạn nào
          </Text>
          <MapPin size={24} color={Colors.primaryBackgroundColor} />
        </View>
        <Divider className="my-4" />
        <View
          className=""
          style={{
            flex: 1,
            alignItems: 'center',
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'transparent',
          }}
        >
          <GooglePlacesAutocomplete
            placeholder="Nhập địa chỉ nè"
            ref={refSuggest}
            styles={{
              container: {
                flex: 1,
                zIndex: 100,
                backgroundColor: 'white',
                position: 'absolute',
                top: 8,
                left: 8,
                right: 8,
                borderRadius: 16,
                ...styles.shadow,
              },
              textInput: {
                textAlign: 'left',
                fontSize: 16,
              },
              listView: {
                zIndex: 1000,
              },
            }}
            renderRightButton={() => {
              return (
                <IconButton
                  icon={'close'}
                  onPress={() => {
                    refSuggest.current.clear();
                    refSuggest.current.blur();
                  }}
                  iconColor="red"
                />
              );
            }}
            nearbyPlacesAPI="GoogleReverseGeocoding"
            disableScroll={true}
            isRowScrollable={true}
            debounce={100}
            fetchDetails
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
              const location = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                name: details.name,
              };
              console.log(location, 'name ne');
              setOrigin([location]);
              refMap.current.animateToRegion(location);
            }}
            query={{
              key: apiKey,
              language: 'vn',
            }}
            keyboardShouldPersistTaps="handled"
          />
          <MapView
            onMapReady={() => {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
                (granted) => {},
              );
            }}
            showsCompass={true}
            followsUserLocation
            style={styles.map}
            initialRegion={{
              latitude: 14.0583,
              longitude: 108.2772,
              latitudeDelta: 0.922,
              longitudeDelta: 0.121,
            }}
            showsBuildings
            showsScale
            loadingEnabled={true}
            region={{
              ...origin[0],
              latitudeDelta: 0.00922,
              longitudeDelta: 0.009421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            ref={refMap}
          >
            {
              //   <MapViewDirections
              //   apikey={apiKey}
              //   origin={origin}
              //   destination={{
              //     latitude: 14.058213,
              //     longitude: 108.27734,
              //   }}
              // />
            }
            {origin.map((marker) => {
              return (
                <Marker
                  key={uuid.v4()}
                  coordinate={marker}
                  ref={refMarker}
                  tracksViewChanges={true}
                >
                  <Callout style={{ flex: 1, position: 'relative' }} tooltip>
                    <View className="rounded-xl p-2 bg-white" style={{}}>
                      <Text numberOfLines={5} className="font-hnow63book">
                        {marker.name}
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>
        <View className="flex-row justify-end gap-2 pt-5">
          <Button
            mode="outlined"
            labelStyle={{
              fontSize: 18,
              color: Colors.primaryBackgroundColor,
            }}
            onPress={() => router.back()}
          >
            Hủy
          </Button>
          <Button
            mode="elevated"
            labelStyle={{
              fontSize: 18,
              color: 'black',
            }}
            onPress={handleSaveAddress}
          >
            Lưu
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Map;
