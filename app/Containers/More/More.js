import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage, Animated
} from 'react-native'

import s from '../../Components/Styles'
import Navbar from '../../Components/NavigationBottom'
import {AnimatedValue } from '../../Utils/TrainUtils';
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    TextView as Text,
    Button,Alert,
    Fonts, Touchable, Scale, TrainRadio} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING, navigateTo } from '../../Utils'
import { MultiSliderTwo } from '../../Components/ItemComponent/Multislider';
import { Language, Currency } from '../../Utils/dummy';
const backAction = NavigationActions.back({key:''}) 

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            name: null,
            email : null,
            animated    : new Animated.Value(0),
            language_type : 'Indonesia',
            currency_type : 'IDR - Rupiah Indonesia',
            country : 'Indonesia'
            
        });
    }

    componentDidMount(){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.setState({name : Function.JsonParse(UserData).client_name, email : Function.JsonParse(UserData).client_email })
            } 
        })
    }
    ActivityResult =(data)=>{
        switch(data.slug){
            case 'country':
            this.setState({country : data.country})
            break;
        }
    }
    render() {
        const { dispatch, navigate } = this.props.navigation;
        let { navigation } = this.props
        return (
            <Container style={s.container}>
                 <Toolbar
                        centerTitle
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = {STRING.Label.others}
                        barStyle    = {s.toolbar}
                      
                    />
                  
                    <ScrollView style={{flex:1, backgroundColor : Colors.white}}>
                        <View style={ss.padding}> 
                            <ItemField
                                type ='optionMenu'
                                label={STRING.Label.help_center}
                                onPress={()=> console.log('')}
                            />
                            <ItemField
                                type ='optionMenu'
                                label={STRING.Label.country}
                                value ={this.state.country}
                                onPress={()=> console.log('')}
                                // onPress={()=> navigate('Country',{ActivityResult : this.ActivityResult})}
                            />
                           
                           <View style={{marginTop : Scale(2),paddingVertical : Metrics.padding.normal, paddingHorizontal :  Metrics.padding.normal,backgroundColor : Colors.white}}>
                               <Text style={{fontSize : Fonts.size.medium, marginBottom : Metrics.padding.normal}}>Bahasa</Text>
                            {Language.language.map((item, i) => (
                                <TrainRadio
                                onPress={()=> console.log('')}
                                    // onPress={value => this.setState({language_type: value }, () => AnimatedValue(this.state.animated, 0))}
                                    currentValue={this.state.language_type}
                                    value={item.name}
                                    text={item.name} />
                            ))}
                              

                               </View>

                               <View style={{flex : 1, marginTop : Scale(2),paddingVertical : Metrics.padding.normal, paddingHorizontal :  Metrics.padding.normal,backgroundColor : Colors.white}}>
                               <Text style={{fontSize : Fonts.size.medium, marginBottom : Metrics.padding.normal}}>{STRING.Label.currency}</Text>
                               
                               {Currency.currency.map((item, i) => (
                                <TrainRadio
                                onPress={()=> console.log('')}
                                    // onPress={value => this.setState({currency_type: value }, () => AnimatedValue(this.state.animated, 0))}
                                    currentValue={this.state.currency_type}
                                    value={item.name}
                                    text={item.name} />
                            ))}

                               </View>
                           
                        </View>
                    </ScrollView>
                    <Navbar active='more'
                    navigation = {navigation}
                    dispatch ={dispatch} />
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
        ,backgroundColor : '#f4f6f9'
    },
    name:{
        fontFamily : Fonts.bold.fontFamily,
        fontWeight : Fonts.bold.fontWeight,
        fontSize : Fonts.size.xtra,
    },
    padding:{
        backgroundColor : Colors.whitesmoke,
        
    },

})

