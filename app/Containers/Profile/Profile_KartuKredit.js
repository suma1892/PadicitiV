import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry
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
    Fonts, Touchable, CardCreditCard} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING } from '../../Utils'
import { listCreditCard } from '../../Utils/dummy';

const backAction = NavigationActions.back({key:''}) 


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            listKartu : listCreditCard.product,
        });
    }   
   
    render() {
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                 <Toolbar
                        centerTitle
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = {STRING.Label.credit_card}
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                    />
                  
                    <View style={{flex:1, backgroundColor : Colors.whitesmoke}}> 
                        <FlatList
                            data = {this.state.listKartu}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem ={({ item }) => (
                                <View style={{marginBottom: Metrics.padding.tiny}}>
                                        <CardCreditCard
                                            numberCard ={item.numberCard}
                                            validThru ={item.validThru}
                                            image ={item.img}
                                            onPressDelete ={()=> console.log('Hapus')}
                                        />
                                </View>
                            )
                        }
                        />
                    </View>
                        
             </Container>
        )
    }
}

const ss = StyleSheet.create({
    emailContainer:{
        flexDirection :'row',
        marginVertical : Metrics.padding.small
    },
    name:{
        fontFamily : Fonts.bold.fontFamily,
        fontWeight : Fonts.bold.fontWeight,
        fontSize : Fonts.size.large,
    },
    padding:{
        marginVertical : Metrics.padding.small
    },

})

