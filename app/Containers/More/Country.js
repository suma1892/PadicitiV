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
    Button,
    Fonts, Touchable, Scale, TrainRadio} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING, navigateTo } from '../../Utils'
import { MultiSliderTwo } from '../../Components/ItemComponent/Multislider';
import {Country} from '../../Utils/dummy';
const backAction = NavigationActions.back({key:''}) 

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            name: null,
            email : null,
            animated    : new Animated.Value(0),
            language_type : 'Indonesia',
            currency_type : 'IDR - Rupiah Indonesia'
            
        });
    }

    componentDidMount(){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.setState({name : Function.JsonParse(UserData).client_name, email : Function.JsonParse(UserData).client_email })
            } 
        })
    }

    Onpres(item) {
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ country: item.name, slug: 'country' })

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
                        title       = {STRING.Label.country}
                        barStyle    = {s.toolbar}
                        left        = {[{
                            icon: 'ic_arrow_back',
                            onPress : () => dispatch(backAction)
                        }]}
                    />
                  
                    <ScrollView style={{flex:1, backgroundColor : Colors.white}}>
                        <View style={ss.padding}> 
                        {Country.country.map((item, i)=>(
                            <ItemField
                            type ='Lableoption'
                            label={item.name}
                            // value ={item.name}
                            onPress={()=> this.Onpres(item)}
                        />
                        ))}
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

