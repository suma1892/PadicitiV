import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage, Linking
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    Toolbar, 
    ItemField, 
    TextView as Text,
    Button,
    Fonts, Touchable, CardPromos, getAirlineLogo} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING } from '../../Utils'
import { listCreditCard } from '../../Utils/dummy';
import Navbar from '../../Components/NavigationBottom'

import { API, getURlHistory } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONGetFile, JSONPostFile } from '../../Services/JsonService'
import { Scale } from '../../Assets/index';
const backAction = NavigationActions.back({key:''}) 
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
           
            Banner : [],
            loading : false,
        });
    }

    componentDidMount(){
        AsyncStorage.getItem('Banner', (err, Banner) => {
            if (Banner) {
               this.setState({Banner : Function.JsonParse(Banner).Banner },
            () =>{
                // console.log(this.state.Banner)
            })
            } 
        })
        
    }
    

    render() {
        const {navigate } = this.props.navigation;
        let { navigation, dispatch} = this.props
        return (
            <Container style={s.container}>
                <Toolbar>
                    <View style={{ flex: 1, alignItems: 'center', }}>
                    <Text style={ss.title}>Promos</Text>
                        
                    </View>

                    <View style={{ justifyContent: 'flex-end' }}>
                        <Touchable
                            onPress={() => console.log('inii')}>
                            <Image
                                style={{ width: Scale(20), height: Scale(20) }}
                                resizeMethod='scale'
                                source={getIcon('ic_shape')}
                            />
                        </Touchable>
                    </View>
                </Toolbar>
                  
                    <View style={{flex:1, marginBottom : Metrics.navBot, backgroundColor : Colors.whitesmoke}}> 
                        <FlatList
                            data = {this.state.Banner}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem ={({ item }) => (
                               
                                        <CardPromos
                                        imgPromos={{uri : item.banner}}
                                        title={item.title}
                                        onPress ={() => item.page ? Linking.openURL(item.page) : console.log('Tidak ada link')}
                                    />
                            )}

                        refreshing={this.state.loading}
                        onRefresh={this.handleRefresh}
                        />
                    </View>

                    <Navbar active='promos'
                    navigation = {navigation}
                    dispatch ={dispatch} />
                        
             </Container>
        )
    }
}

const ss = StyleSheet.create({
    title: {
        height: Scale(25),
        fontSize: Scale(18),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#ffffff"
    }

})

