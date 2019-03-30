import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage, Alert as Confirmation
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    TextView as Text,
    Button,
    Fonts, Touchable,
    Alert} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING, navigateTo } from '../../Utils'
import { MultiSliderTwo } from '../../Components/ItemComponent/Multislider';
const backAction = NavigationActions.back({key:''}) 



export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            name: null,
            email : null
            
        });
    }

    componentDidMount(){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.setState({name : Function.JsonParse(UserData).client_name, email : Function.JsonParse(UserData).client_email })
            } 
        })
    }

    backAndroid(){
        navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
    }

    Confirmation(){
        Confirmation.alert(
            'Would you like to sign out ?',
            '',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.CheckUser()},
            ],
            { cancelable: false }
          )
    }

    CheckUser (){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
                Function.DeleteAsyncStorage(['UserData'])
                Alert('Berhasil Sign Out')
                navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
            } else {

                AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                    if (CustomerData !== null) {
                        Function.DeleteAsyncStorage(['CustomerData'])
                        Alert('Sign Out Succes')
                        navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
                    }
                })
            }
        })
    }
   
    render() {
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                 <Toolbar
                        centerTitle
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       ='Profile'
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => this.backAndroid()
                                    }]}
                    />
                  
                    <ScrollView style={{flex:1, backgroundColor : '#f4f6f9'}}>
                        <View style={[s.marginNormal]}>
                            <View>
                                <Text style={ss.name}>Hi, {this.state.name}</Text>
                                <View style={ss.emailContainer}>
                                    <View style={{flex :1}}>
                                        <Text style={s.fontSmallGray}>{this.state.email}</Text>
                                    </View>
                                    <Touchable onPress={()=> console.log('')}>
                                        <View style={s.close}>
                                                <Text style={s.itemClose}>EDIT</Text>
                                        </View>
                                    </Touchable>
                                </View>
                            </View>
                        </View>
                        <View style={ss.padding}> 
                            <ItemField
                                type ='optionMenu'
                                label= {STRING.Label.credit_card}
                                onPress={()=> console.log('')}
                                // onPress={()=> navigate('Profile_KartuKredit')}
                            />
                            <ItemField
                                type ='optionMenu'
                                label={STRING.Label.costumer_profile}
                                onPress={()=> navigate('Profile_Penumpang')}
                            />
                            <ItemField
                                type ='optionMenu'
                                label={STRING.Label.notif}
                                onPress={()=> console.log('')}
                            />
                            {/* <ItemField
                                type ='optionMenu'
                                label={STRING.Label.review}
                                onPress={()=> console.log('')}
                            /> */}
                            <ItemField
                                type ='optionMenu'
                                label='PadiPoint'
                                onPress={()=> console.log('')}
                            />
                            <ItemField
                                type ='optionMenu'
                                label={STRING.Label.call_me}
                                onPress={()=> navigate('Call')}
                            />
                            <ItemField
                                type ='optionMenu'
                                label='Sign Out'
                                onPress={()=> this.Confirmation()}
                            />
                        </View>
                    </ScrollView>
                    
             </Container>
        )
    }
}

const Headertitle = props => (
    <View style={style.headertitle}>
        {props.title && <Text ellipsizeMode='tail' numberOfLines={1} style={s.headerText}>{props.title}</Text>}
    </View>
)
const ss = StyleSheet.create({
    emailContainer:{
        flexDirection :'row',
        marginVertical : Metrics.padding.small
    },
    name:{
        fontFamily : Fonts.bold.fontFamily,
        fontWeight : Fonts.bold.fontWeight,
        fontSize : Fonts.size.xtra,
    },
    padding:{
        backgroundColor : Colors.whitesmoke,
        marginVertical : Metrics.padding.small,
        
    },

})

