import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    Image,
    FlatList, AsyncStorage
} from 'react-native'
import {
    TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Touchable,getAirlineLogo
} from '../../Components/'
import { sort_list, filter_time, filter_transit } from '../../Services/JSON/Sort_Filter';
import {Function, STRING} from '../../Utils'
export default class FlightSortFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_value  : null,
            transit_value : null,
            airLine_value : null,
            sort_value  : null,
            groupFlight : []
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('FlightGroup', (err, FlightGroup) => {
            if (FlightGroup !== null) {
            this.setState({groupFlight : []},() =>{
                this.setState({groupFlight : Function.JsonParse(FlightGroup)}, () => {
                     
                 })
            })
            
        } 
        })

        const { params } = this.props.navigation.state;
        this.setState({sort_value : params.sort_value,
            time_value  : params.time_value,
            transit_value : params.transit_value,
            airLine_value : params.airLine_value,})
    }

    action(){
        const { params } = this.props.navigation.state;
        const { navigation } = this.props
        const { state, goBack } = navigation
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({slug: 'filter_data',
            time_value  : this.state.time_value,
            transit_value : this.state.transit_value,
            airLine_value : this.state.airLine_value,
            dataDepart   : params.dataDepart
        })
    }
    render() {
        const { navigation } = this.props
        const { state, goBack } = navigation

        return (
            <View style={s.container}>
                <Toolbar  
                    arrow_back
                    onPress ={ () => goBack()}>
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <Text style ={s.toolbar_title}>{STRING.Function_name.filter.toLowerCase()}</Text>

                        {state.params && state.params.slug === 'filter' &&
                            <Touchable onPress={() => this.setState({time_value: null, transit_value: null, airLine_value: null})}>
                                <View style={s.btn_reset}>
                                    <Text style={s.btn_reset_txt}>RESET</Text>
                                </View>
                            </Touchable>
                        }
                    </View>
                </Toolbar>

                {state.params && state.params.slug === 'sort' && <ScrollView>
                    {sort_list.map((item, index) => (
                        <ItemListCheck
                            key     = {index}
                            onPress ={() => this.setState({sort_value: item.slug}, () => {
                                navigation.goBack();
                                this.props.navigation.state.params.ActivityResult({slug: this.state.sort_value, })
                              
                            })}
                            title   ={item.title}
                            subtitle={item.subtitle}
                            slug    ={item.slug}
                            active  ={this.state.sort_value === item.slug} />
                    ))}
                </ScrollView>}
                
                {state.params && state.params.slug === 'filter' && 
                
                <ScrollView
                    style={{ backgroundColor: Colors.whitesmoke }}>

                    <View style={{ backgroundColor: Colors.white }}>
                        <Text style={s.title_section}>{STRING.Function_name.airline}</Text>
                        <FlatList
                            contentContainerStyle={{ marginHorizontal: Scale(4) }}
                            scrollEnabled={false}
                            data={Function.find_duplicate_in_array(state.params.groupFligthFilter)}
                            renderItem={({ item }) => (
                                <ItemListImageCheckBox
                                
                                onPress={() => this.setState({ airLine_value: item.airlineCode })}
                                title={Function.ObjectNull(item,'airline') && item.airline.split(' ').length > 1 ? item.airline.split(' ')[0] : item.airline}
                                Image={item.airlineCode.toLowerCase()}
                                slug={item.airlineCode}
                                active={this.state.airLine_value === item.airlineCode}
                                 />
                            )}
                            keyExtractor={(item, index) => index}
                            numColumns={3}
                             />
                        
                    </View>

                    <View style ={{marginTop : Scale(8), backgroundColor : Colors.white}}>
                    <Text style={s.title_section}>{STRING.Function_name.time}</Text>
                    {filter_time.map((item, index) => (
                            <ItemListCheckBox 
                                key     = {index}
                                onPress ={() => this.setState({time_value: item.slug})}
                                title   ={item.title}
                                subtitle={item.subtitle}
                                slug    ={item.slug}
                                active  ={this.state.time_value === item.slug} />
                        ))}
                        </View>
                    
                        <View style ={{marginTop : Scale(8), backgroundColor : Colors.white}}>
                    <Text style={s.title_section}>{STRING.Function_name.numberOf_transits}</Text>
                    {filter_transit.map((item, index) => (
                            <ItemListCheckBox 
                                key     = {index}
                                onPress ={() => this.setState({transit_value: item.slug})}
                                title   ={item.title}
                                subtitle={item.subtitle}
                                slug    ={item.slug}
                                active  ={this.state.transit_value === item.slug} />
                        ))}
                        </View>
                   
                </ScrollView>
           }

                {state.params && state.params.slug === 'filter' && 
                <Touchable
                onPress ={() => this.action()}>
                <View style={s.btn_apply}>
                    <Text style={s.btn_apply_txt}>Apply</Text>
                </View>
                </Touchable>
                }

            </View>
        )
    }
}

class ItemListCheckBox extends Component {
    render() {
        let {props} = this
        return (
            <Touchable onPress={props.onPress}>
                <View style={s.item_frame}>
                    {props.title && <Text style={s.item_title}>{props.title}</Text>}
                    {props.subtitle && <Text style={s.item_subtitle}>{props.subtitle}</Text>}
                    <View style={[s.checkbox, props.active && {borderColor: Colors.pizzaz}]}>
                        <View style={props.active && s.checkbox_active}/>
                    </View>

                </View>
            </Touchable>
        )
    }
}

class ItemListImageCheckBox extends Component {
    render() {
        let {props} = this
        return (
            <Touchable onPress={props.onPress}>
                <View style={[s.item_frame, {borderBottomColor: Colors.white,alignItems : 'center'}]}>

                <View style={[s.checkbox, props.active && {borderColor: Colors.pizzaz}]}>
                        <View style={props.active && s.checkbox_active}/>
                    </View>

                    <View style ={{marginHorizontal : Scale(4)}}>
                    {props.Image && <Image
                    style = {{width : Scale(40), height : Scale(40)}}
                    resizeMethod='scale'
                    source={getAirlineLogo(props.Image)}/> }
                    {props.title && <Text style={s.item_title}>{props.title}</Text>}
                    </View>
                   

                </View>
            </Touchable>
        )
    }
}

class ItemListCheck extends Component {
    render() {
        let {props} = this
        return (
            <Touchable onPress={props.onPress}>
                <View style={s.item_frame}>
                    {props.title && <Text style={s.item_title}>{props.title}</Text>}
                    {props.subtitle && <Text style={s.item_subtitle}>{props.subtitle}</Text>}
                    <View style={[s.check, props.active && {borderColor: Colors.pizzaz}]} />

                </View>
            </Touchable>
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(16),
        color: Colors.white,
        flex: 1,
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },

    title_section:{
        ...Fonts.bold,
        fontSize: Fonts.size.medium,
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
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

    check:{
        backgroundColor: Colors.white,
        borderColor: Colors.transparent,
        borderBottomWidth: Scale(2),
        borderRightWidth: Scale(2),
        width: Scale(10),
        height: Scale(20),
        transform: [{rotate: '45deg'}]
    },

    checkbox_active:{
        backgroundColor: Colors.pizzaz,
        flex: 1,
        borderRadius: Scale(2)
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

    btn_reset:{
        borderWidth: 1,
        borderColor: Colors.pizzaz,
        borderRadius: Scale(3),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(4),
    },
    btn_reset_txt:{
        color: Colors.pizzaz,
    },

    btn_apply:{
        backgroundColor: Colors.pizzaz,
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_apply_txt:{
        fontSize: Fonts.size.medium,
        color: Colors.white
    }
})

AppRegistry.registerComponent("padiciti", () => TrainSortFilter);
