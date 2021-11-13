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

  export default class Maps extends Component {
    constructor() {
      super()
      this.state = {
        latitude: 0,
        longitude: 0,
        error: null,
        marker: null
      }

      this.getLocation = this.getLocation.bind(this);
    }
    componentDidMount(){
        Geolocation.getCurrentPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null
            })
        }, error => this.setState({error: error.message}),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000})
        console.log(this.state.latitude, this.state.longitude, this.state.error)
    }

    getLocation(){
      var coord = JSON.stringify(this.state.marker)
      this.props.navigation.navigate('SelectMap', {text:coord})
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
                latitudeDelta:0.0922, 
                longitudeDelta: 0.0421}}>
                    {this.state.marker && <Marker coordinate={this.state.marker}/>}
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