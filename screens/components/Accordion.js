import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Expand from 'react-native-simple-expand';
import { COLORS, SIZES } from '../../constants';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        borderWidth: 0
    },

    header: {
        height: 50,
        paddingLeft: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerText: {
        
    },

    bodyText: {
        fontSize: SIZES.font,
        marginLeft: 50,
        color: COLORS.black
    },

    icon: {
        color: COLORS.lightGray,
        marginRight: 30
    }
});

class Accordion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    render() {
        let expandIcon = <Icon iconStyle={styles.icon} name='expand-more' size={32} color={COLORS.black} />
        if (this.state.open)
            expandIcon = <Icon iconStyle={styles.icon} name='expand-less' size={32} color={COLORS.black} />

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.setState({ open: !this.state.open })}>
                    <View style={[styles.header, this.props.containerStyle]}>
                        <Text style={[styles.headerText, this.props.headerText]}>
                            {this.props.title}
                        </Text>
                        {expandIcon}
                    </View>
                </TouchableOpacity>
                <Expand value={this.state.open}>
                    {
                        typeof this.props.body === 'string' ?
                        <Text style={[styles.bodyText, this.props.bodyText]}>
                            {this.props.body}
                        </Text>
                        : this.props.body
                    }
                </Expand>
            </View>
        );
    }
}

export default Accordion;