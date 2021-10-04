import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },


    activityIndicatorContainer: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom: 60
    }
});

export default class extends React.Component {
    render() {
        return (
            <View style={styles.container} >
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size='large' color={COLORS.white}/>
                </View>
            </View>
        );
    }
}
