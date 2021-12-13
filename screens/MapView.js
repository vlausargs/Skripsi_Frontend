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
        width:100,
        height: 30
    },
  });
  const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
  const circumference = (40075 / 360) * 1000;
  const distance  = 10000
  const angularDistance = distance/circumference

  export default class Maps extends Component {

    constructor(props) {
      super(props)
      this.state = {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta:0,
        error: null,
        marker: null,
        lat1:null,
        long1: null,
      }

      this.getLocation = this.getLocation.bind(this);
    }
    componentDidMount(){
        Geolocation.getCurrentPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta:  distance / oneDegreeOfLongitudeInMeters,
                longitudeDelta: Math.abs(Math.atan2(
                  Math.sin(angularDistance)*Math.cos(position.coords.latitude),
                  Math.cos(angularDistance) - Math.sin(position.coords.latitude) * Math.sin(position.coords.latitude))),
                error: null
            })
        }, error => this.setState({error: error.message}),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000})
        
    }
    componentDidUpdate(){
      console.log(this.state.latitude, this.state.longitude,this.state.latitudeDelta, this.state.longitudeDelta, this.state.error)
    }

    getLocation(){
      var coord = JSON.stringify(this.state.marker)
      //this.props.navigation.navigate('RegisterCompany', {text:coord})
      console.log(coord)
      this.setState({
        lat1:this.state.marker,
        long1:this.state.marker
      })
      alert(coord)
    }

    render() {
        return (
          <View style={styles.container}>
            <MapView 
              showsUserLocation={true}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              onPress={(e) => this.setState({marker: e.nativeEvent.coordinate})}
              initialRegion={{
                latitude: this.state.latitude, 
                longitude: this.state.longitude, 
                latitudeDelta:this.state.latitudeDelta, 
                longitudeDelta: this.state.longitudeDelta}}>
                  <View >
                    {/* <CompanyMarker/> */}
                    </View>
              </MapView>
              <View style={styles.button}>
                <TouchableOpacity onPress={this.getLocation} style={styles.Login}>
                  <Text style={{color: COLORS.white}}>
                    getLocation
                  </Text>
                </TouchableOpacity>
                </View>
          </View>
        );
    }
  }