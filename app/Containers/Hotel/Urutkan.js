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
    TextView as Text, CheckListButton,Fonts,Scale,Touchable,
    Button} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { STRING } from '../../Utils';
const backAction = NavigationActions.back({key:''}) 

const listSorting = [
    {id: 0, label: 'Harga-Termurah', slug : 'priceAsc'},
    {id: 1, label: 'Harga-Termahal', slug : 'priceDsc'},
]

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            select     : 'priceAsc',
            input      : '',
            data : listSorting
        });
    }

    componentDidMount(){
        const { params } = this.props.navigation.state;
        this.setState({select : params.slug})

    }

    option(value) {
        const { navigation } = this.props;
        var dataList = this.state.data
        this.setState({data : [], select : value}, () =>{
         this.setState({data : dataList}, () =>{
            navigation.goBack();
            this.props.navigation.state.params.ActivityResult({slug: this.state.select })
    
         })
        })
    }
   
    render() {
        const { dispatch , navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                 <Toolbar
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = {STRING.Function_name.sort.charAt(0).toUpperCase()}
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                    />
                     <View>
                     <FlatList 
                            data            = {this.state.data}
                            extraData       = {this.state}
                            keyExtractor    = {(item, index) => index}
                            renderItem      = {({ item , index}) => (
                                <ItemListCheck
                                    key     = {index}
                                    title   = {item.label}
                                    slug   = {item.slug}
                                    active= {this.state.select === item.slug}
                                    onPress= {() => {this.option(item.slug)}}/>
                            )}
                            
                            />
            </View>
             </Container>
        )
    }
}

const Headertitle = props => (
    <View style={style.headertitle}>
        {props.title && <Text ellipsizeMode='tail' numberOfLines={1} style={s.headerText}>{props.title}</Text>}
    </View>
)

class ItemListCheck extends Component {
    render() {
        let {props} = this
        return (
            <Touchable onPress={props.onPress}>
                <View style={style.item_frame}>
                    {props.title && <Text style={style.item_title}>{props.title}</Text>}
                    {props.subtitle && <Text style={style.item_subtitle}>{props.subtitle}</Text>}
                    <View style={[style.check, props.active && {borderColor: Colors.pizzaz}]} />

                </View>
            </Touchable>
        )
    }
}
const style = StyleSheet.create({
   headertitle:{
        paddingHorizontal : Metrics.padding.normal,
        paddingVertical : Metrics.padding.small
   },
   item_frame:{
       backgroundColor: Colors.white,
       paddingHorizontal: Scale(16),
       paddingVertical: Scale(11),
       flexDirection: 'row',
       borderBottomWidth: 1,
       borderBottomColor: Colors.border,
   },
   item_title:{
       fontSize: Fonts.size.regular,
       flex: 1,
   },
   item_subtitle:{
    flex: 4,
    fontSize: Fonts.size.regular,
    color: Colors.warm_grey
},
check:{
    backgroundColor: Colors.white,
    borderColor: Colors.transparent,
    borderBottomWidth: Scale(2),
    borderRightWidth: Scale(2),
    width: Scale(10),
    height: Scale(20),
    transform: [{rotate: '45deg'}]
},

})

