import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image,
    Platform, WebView,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking
} from 'react-native'
import { Colors, Metrics, Toolbar, TextView, RadioButtons, DialogComponent } from '../../Components'

import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Function } from '../../Utils'
import { getIcon } from '../../Assets';
import array from '../../Utils/array'
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title : null,
            full_name: null,
            phone_num: null,
            email: null,
            full_name_error : null,
            phone_num_error : null,
            email_error : null,
            title : 'Mr',
            radioItems : array.TitleAdult(),
            filterActive : false
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
       
    }
    

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }

    changeActiveRadioButton(index) {
       

    }


    render() {
        return (
            <View style={styles.frame} >
                <View style={{backgroundColor: '#3b65d6' }} >

                    <Toolbar
                        arrow_back
                        style={{ backgroundColor: 'transparent' }}
                        onPress={() => this.backAndroid()}
                        View={<TextView
                            style={styles.lableTitle}
                            text={"Write a review"}
                        />}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding :  Scale(8) }}>
                        
                    <TitleLayout
                    num ={'1'}
                    lbl ={'When did you travel on tour?'}/>

                    <TitleLayout
                    num ={'2'}
                    lbl ={'How would you rate the overall experience?'}/>
                    <TitleLayout
                    num ={'3'}
                    lbl ={'Write your review'}/>
                                       
                    </View>
                    
                </ScrollView>

                <DialogComponent
                            active={this.state.filterActive}
                            open={() => this.setState({ filterActive: true })}
                            close={() => this.setState({ filterActive: false })}
                            title={'Title'}
                            // action  = {() => this.Confirmation()} 
                            position='center'
                        >
                            {this.state.radioItems.map((item, key) => (
                                <View style={{ padding: Metrics.sizePad }}>
                                    <RadioButtons key={key} button={item}
                                        onClick={this.changeActiveRadioButton.bind(this, key)}
                                    />
                                </View>
                            ))}

                        </DialogComponent>
            </View>


        );
    }
}


const TitleLayout =     props =>(
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom : Scale(16)}}>
                            <View style={{
                                width: Scale(35),
                                height: Scale(35),
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#aaaaaa",
                                borderRadius: Scale(35) / 2,
                                justifyContent:'center',
                                alignItems: 'center'
                            }}>
                                <TextView style={{fontSize: Scale(18), color: "#aaaaaa" }}>{props.num}</TextView>
                            </View>
                            <View>
                            <TextView style={{ fontSize: Scale(14), color: "#000000", marginLeft: Scale(16) }}>{props.lbl}</TextView>
                            {props.lbJpg && <TextView style={{ width: Metrics.screenWidth/1.2, fontSize: Scale(14), color: "#666666", marginLeft: Scale(16) }}>{'You can upload any of these formats: JPG, PNG'}</TextView>}
                            </View>
                    </View>
)


const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(18), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(16),
        bottom: Scale(8),
        color: Colors.blue
    }
});
AppRegistry.registerComponent("padiciti", () => Review);
