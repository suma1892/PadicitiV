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
    Button, Scale, Touchable} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING, array } from '../../Utils'
import { MultiSliderTwo } from '../../Components/ItemComponent/Multislider';
const backAction = NavigationActions.back({key:''}) 



export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            price_range :[40, 100],
            checkbox : 1,
            min : 0,
            max : 0,
            listfacilities :[
                {
                    id: 1,
                    name :'Wifi'
                },
                {
                    id: 2,
                    name :'Restoran'
                },
                {
                    id: 3,
                    name :'Parkir'
                },
                {
                    id: 4,
                    name :'Kolam Renang'
                },
                {
                    id: 5,
                    name :'Resepsionis 24 Jam'
                },
            ],
            listStar :[
                {
                    id: 1,
                    name :'1'
                },
                {
                    id: 2,
                    name :'2'
                },
                {
                    id: 3,
                    name :'3'
                },
                {
                    id: 4,
                    name :'4'
                },
                {
                    id: 5,
                    name :'5'
                },
            ]
        });
    }
    componentDidMount(){
        const { params } = this.props.navigation.state;
        console.log('params.price_range')
        console.log(params.price_range)
        this.setState({checkbox : params.starsSlug, price_range: []}, ()=>{
            this.setState({price_range: params.price_range, max : params.max})
        })
    }
   
    optionStart(value){
        const { navigation } = this.props;
       var arrayListStart = this.state.listStar
        this.setState({listStar : [], checkbox : value},()=>{
            this.setState({listStar : arrayListStart})
        })
    }
    multiSliderValuesChange = (values) => {
        this.setState({price_range : []}, () => {
        this.setState({
            price_range: values,
        })    
        })
        
        }

        Action(value){
            const { navigation } = this.props;
           var arrayListStart = this.state.listStar
           navigation.goBack();
           this.props.navigation.state.params.ActivityResult({slug : 'filter',slugStars: this.state.checkbox, price_range : this.state.price_range })
              
        }

    render() {
        const { params } = this.props.navigation.state;
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                 <Toolbar
                        close 
                        // onPressClose = {()=>console.log('')}
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = {STRING.Function_name.filter.toUpperCase()}
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () => dispatch(backAction)
                                    }]}
                        onPressReset = {() => this.setState({price_range : params.backUpprice_range, checkbox : 0})}
                    />
                    <ScrollView>
                    <View style={style.sectionCondition}>   
                        <Headertitle
                            title = {STRING.Label.range_price}
                        />
                        <MultiSliderTwo
                                    value ={this.state.price_range ? this.state.price_range: [0,1000000]}
                                    onValuesChange = {this.multiSliderValuesChange}
                                    max = {this.state.max ? this.state.max : 1000000}
                                />
                    </View>
                    <View style={style.sectionCondition}>
                        <Headertitle
                            title ={STRING.Label.star_label}
                        />
                         <View style={{paddingVertical:Metrics.padding.tiny}}>
                            {(this.state.listStar).map((item, i) =>  (
                                <View key={i} style={{marginBottom : Metrics.padding.small}}>
                                    <ItemListImageCheckBox
                                           Image = {item.id}
                                           onPress={() => this.setState({checkbox :item.id })}
                                           slug= {item.id}
                                           active ={this.state.checkbox === item.id}
                                       />
                            </View>
                            ))}
                        </View> 
                    </View>
                    
                    </ScrollView>
                    <Button 
                        typePadding ='fullsize'
                        onPress ={() => this.Action()}
                        >Apply</Button>
             </Container>
        )
    }
}

class ItemListImageCheckBox extends Component {
    render() {
        let {props} = this
        const star =Array.from({length : props.Image})
        return (
            <Touchable onPress={props.onPress}>
                <View style={[style.item_frame, {borderBottomColor: Colors.white,alignItems : 'center'}]}>

                <View style={[style.checkbox, {width : Scale(20), height : Scale(20), alignItems : 'center', alignContent : 'center'}]}>
                <Image 
                                source={getIcon('ic_checked')}
                                resizeMode={'contain'}
                                style={{width : Scale(16), height : Scale(16), tintColor :  props.active ? Colors.tangerine :Colors.white}}
                                />
                    </View>

                    <View style ={{marginHorizontal : Scale(4)}}>
                    <View style={{flexDirection :'row'}}>
                    {props.Image && 
                    star.map ((_, i) =>
                    <Image
                    key={i}
                    style = {{width : Scale(20), height : Scale(20)}}
                    resizeMethod='scale'
                    source={getIcon('ic_star')}/>) }
                    </View>
                    </View>
                   

                </View>
            </Touchable>
        )
    }
}

const Headertitle = props => (
    <View style={style.headertitle}>
        {props.title && <Text ellipsizeMode='tail' numberOfLines={1} style={s.headerText}>{props.title}</Text>}
    </View>
)
const style = StyleSheet.create({
   headertitle:{
        paddingHorizontal : Metrics.padding.normal,
        paddingVertical : Metrics.padding.small
   },
   section :{
    paddingHorizontal : Metrics.padding.normal,
    paddingVertical : Metrics.padding.small,
    borderBottomColor : Colors.borderColor,
    borderBottomWidth :2
   },
   sectionCondition:{
    flex:1,
    paddingVertical : Metrics.padding.small,
    borderBottomColor : Colors.borderColor,
    borderBottomWidth :4
},
item_frame:{
    backgroundColor: Colors.white,
    paddingHorizontal: Scale(12),
    paddingVertical: Scale(8),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
},
checkbox:{
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: Scale(2.5),
    width: Scale(17.5),
    height: Scale(17.5),
    borderRadius: Scale(4),
    padding: Scale(2),
},

})

