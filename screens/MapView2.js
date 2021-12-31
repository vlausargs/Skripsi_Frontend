import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { TouchableOpacity } from "react-native-gesture-handler";
import CompanyMarker from "./components/CompanyMarker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    alignItems: 'center'
  },
  Login: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 100,
    height: 40
  },
});
const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
const circumference = (40075 / 360) * 1000;
const distance = 5000
const angularDistance = distance / circumference

export default class Maps2 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      region:null,
      marker: null
    }

    this.getLocation = this.getLocation.bind(this);
    // this.getCurrentLocation = this.getCurrentLocation.bind(this);
  }
  getCurrentLocation() {
    Geolocation.getCurrentPosition(position => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: distance / oneDegreeOfLongitudeInMeters,
          longitudeDelta: Math.abs(Math.atan2(
            Math.sin(angularDistance) * Math.cos(position.coords.latitude),
            Math.cos(angularDistance) - Math.sin(position.coords.latitude) * Math.sin(position.coords.latitude))),
          error: null
        }
      })
    }, error => this.setState({ error: error.message }),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 })
    // console.log("callback")
    // return false;
  }
  componentDidMount() {
    this.getCurrentLocation();
  }
  componentDidUpdate() {
    // console.log(this.state.region)
  }

  callback(marker) {
    this.setState({ marker: marker })
}

  getLocation() {
    var coord = JSON.stringify(this.state.marker)
    //this.props.navigation.navigate('RegisterCompany', {text:coord})
    // console.log(coord)
    this.setState({
      lat1: this.state.marker,
      long1: this.state.marker
    })
    // const { navigation } = this.props;
    const {onGoBack} = this.props.route.params
    console.log(this.props.route.params)
    onGoBack({lat:this.state.marker.latitude,long:this.state.marker.longitude})
    this.props.navigation.goBack();
    alert(coord)
  }
  showMap() {
    return this.state.region != null ? (
      <MapView
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onPress={(e) => {this.setState({ marker: e.nativeEvent.coordinate }); console.log(e.nativeEvent.coordinate)}}
        initialRegion={this.state.region}
        region={this.state.region}>
          {this.state.marker&&<Marker coordinate={this.state.marker}/>}
      </MapView>) : (
      <MapView
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
      >

      </MapView>)
  }
  render() {
    return (
      <View style={styles.container}>
        {this.showMap()}
        <View style={styles.button}>
          <TouchableOpacity onPress={this.getLocation} style={styles.Login}>
            <Text style={{ color: COLORS.white }}>
              Select as company
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}