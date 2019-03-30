import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, Linking
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
    Fonts, Touchable, CardCall} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING } from '../../Utils'
import { listCall } from '../../Utils/dummy';

const backAction = NavigationActions.back({key:''}) 


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            listKartu : listCall.product,
        });
    }   

    action(item){
        switch(item.id){
            case '1':
            Linking.openURL('tel://'+item.validThru)
            break
            case '2':
            
            Linking.openURL('whatsapp://send?phone='+ item.validThru);
            break
            case '3':
            
            Linking.openURL('mailto:cs@padiciti.com?subject=Hallo&body=body');
            break

        }
    }
   
    render() {
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                 <Toolbar
                        centerTitle
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = {STRING.Label.call_me}
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                    />
                  
                    <View style={{flex:1, backgroundColor : Colors.white}}> 
                        <FlatList
                            data = {this.state.listKartu}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem ={({ item }) => (
                                <View style={{marginBottom: Metrics.padding.tiny}}>
                                        <CardCall
                                            numberCard ={item.numberCard}
                                            validThru ={item.validThru}
                                            image ={item.img}
                                            onPressDelete ={()=> this.action(item)}
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

