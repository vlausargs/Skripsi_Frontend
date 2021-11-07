import React, {PureComponent} from 'react';
import {View,Text,Button,TouchableOpacity, BackHandler} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../constants';

class Step extends PureComponent {
    handleBackButton= ()=>{
        // console.log(data.steps)
        switch(this.props.currentIndex) {
            case 0:
                // navigation.goBack(null);
                return false;
                break;
            default:
                this.props.prevStep();
                return true;
                break;
        }

    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    state = {  }
    render() {
        return (
            <View style={{flex:1}}>
             
                {this.props.children({
                    onChangeValue:this.props.onChangeValue,
                    values:this.props.values,
                })} 

                <TouchableOpacity  
                    title="Next" 
                    disabled={this.props.isLast}
                    onPress={this.props.nextStep} 
                    style={{textAlign: 'center',alignSelf: 'stretch',backgroundColor: COLORS.primary, margin:SIZES.padding/2,paddingVertical:SIZES.padding/2,opacity:this.props.isLast ?  0.7:1}}
                    >
                    <Text style={{...FONTS.h3,textAlign: 'center'}}>Next</Text>
                </TouchableOpacity >
                <TouchableOpacity  
                    title="Prev" 
                    disabled={this.props.isFirst}
                    onPress={this.props.prevStep} 
                    style={{textAlign: 'center',alignSelf: 'stretch',backgroundColor: COLORS.primary, margin:SIZES.padding/2,paddingVertical:SIZES.padding/2,opacity:this.props.isFirst ? 0.7:1}}
                    >
                    <Text style={{...FONTS.h3,textAlign: 'center'}}>Prev</Text>
                </TouchableOpacity >
            </View>
        );
    }
}


class Wizard extends PureComponent {
    static Step = (props) => <Step {...props}/>
    state = { 
        index: 0,
        values:{
            ...this.props.initialValues,
        }
    }

    _nextStep = () =>{
        if(this.state.index != this.props.children.length -1){
            this.setState(prevState => ({
                index:prevState.index + 1,
            }))
        }
    }
    _prevStep = () =>{
        if(this.state.index != 0){
            this.setState(prevState => ({
                index:prevState.index - 1,
            }))
        }
    }
    _onChangeValue = (name,value)=>{
        this.setState(prevState =>({
                values:{
                    ...prevState.values,
                    [name]:value,
                }
            })
        )
    }

    render() {
        console.log('values', this.state)
        return (
            <View style={{flex:1}}>
                {React.Children.map(this.props.children,(el,index)=>{
                    if(index == this.state.index){
                        return React.cloneElement(el,{
                            currentIndex: this.state.index,
                            nextStep:this._nextStep,
                            prevStep:this._prevStep,
                            onChangeValue:this._onChangeValue,
                            isLast:this.state.index == this.props.children.length -1,
                            isFirst:this.state.index == 0,
                            values:this.state.values,
                        })
                    }
                    return null;
                })}
            </View>
        );
    }
}

export default Wizard;