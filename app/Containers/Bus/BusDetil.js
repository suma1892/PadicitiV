import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
} from 'react-native'
import {
    TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Metrics
} from '../../Components/'
import moment from 'moment'
import { Function } from '../../Utils'

export default class BusDetil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title   : this.props.navigation.state.params.title,
            data    : this.props.navigation.state.params.data
        }
    }

    render() {
        let { navigation } = this.props
        let { data, title } = this.state

        return (
            <View style={s.container} >
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.goBack()}>
                    <View>
                        <Text style={s.toolbar_title}>Detail Bus</Text>
                    </View>
                </Toolbar>
                <View style={{flex:1}}>
                    <View style={s.train_section}>
                        <Text style={s.title_section}>{title}</Text>
                        <Text style={s.train_route}>{data.org} - {data.des}, {data.dep_date_2}</Text>
                    </View>
                    <View style={s.train_routes_section}>
                        <Text style={s.train_name}>{data.travelName}</Text>
                        <View>
                            <View style={s.route_section}>
                                <View style={s.separator_start}>
                                    <View style={s.circle_outline}/>
                                    <View style={[s.route_line, {flex: 0.5}]}/> 
                                </View>
                                <View style={s.route_time_date}>
                                    <Text style={s.route_time}>{data.dep_time}</Text>
                                    <Text style={s.route_date}>{data.dep_date_2}</Text>
                                </View>
                                <View>
                                    <Text ellipsize style={[s.route_station,{width : Metrics.screenWidth/1.5}]}>{data.boardingTimesDetails[0].name}</Text>
                                </View>
                            </View>
                            <View style={s.route_section}>
                                <View style={s.separator_middle}>
                                    <View style={s.route_line}/> 
                                </View>
                                <Text style={s.route_duration}>{data.duration_string}, Langsung</Text>
                            </View>
                            <View style={s.route_section}>
                                <View style={s.separator_end}>
                                    <View style={[s.route_line, {flex: 0.5}]}/> 
                                    <View style={[s.circle_outline, {backgroundColor: Colors.blumine}]}/>
                                </View>
                                <View style={s.route_time_date}>
                                    <Text style={s.route_time}>{data.arv_time}</Text>
                                    <Text style={s.route_date}>{data.arv_date_2}</Text>
                                </View>
                                <View>
                                    <Text ellipsize style={[s.route_station,{width : Metrics.screenWidth/1.5}]}>{data.droppingTimesDetails[0].name}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={s.summary_section}>
                    <View style={{flex:1}}>
                        <Text style={s.summary_title_desc}>Harga Per-orang</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={s.summary_price}>IDR {Function.convertToPrice(data.price.split('.')[0] || 0)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(12),
        color: Colors.white
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },


    train_section:{
        margin: Scale(14),
        marginBottom: 0,
        paddingBottom: Scale(14),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.warm_grey,
    },
    title_section:{
        fontSize: Fonts.size.large,
        color: Colors.blumine
    },
    train_route:{
        color: Colors.warm_grey
    },  
    route_section:{
        // margin: Scale(8),
        flexDirection: 'row',
    },
    train_routes_section:{
        padding: Scale(14)
    },
    train_name:{
        fontSize: Fonts.size.large,
        marginBottom: Scale(4)
    },
    route_time:{
        fontSize: Fonts.size.medium
    },
    route_date:{
        fontSize: Fonts.size.small,
        color: Colors.warm_grey
    },
    item_route:{
        flexDirection: 'row'
    },
    route_station:{
        fontSize: Fonts.size.medium
        
    },
    route_time_date:{
        minWidth: Metrics.screenWidth / 6,
    },


    summary_section:{
        flexDirection: 'row',
        // justifyContent: 'center',
        backgroundColor: Colors.concrete,
        padding: Scale(16)
    },
    summary_title_desc:{
        fontSize: Fonts.size.medium * .9
    },
    summary_price:{
        alignSelf: 'flex-end',
        fontSize: Fonts.size.xtra,  
        color: Colors.pizzaz,
        ...Fonts.bold
    },

    circle_outline:{
        height: Metrics.icon.tiny / 1.5,
        width: Metrics.icon.tiny / 1.5,
        borderRadius: Metrics.icon.tiny / 3,
        borderWidth: 1,
        borderColor: Colors.blumine,
    },

    route_line: {
        width: 1,
        backgroundColor: Colors.blumine,
        flex: 1
    },

    separator_start: {
        width: Scale(20),  
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    separator_middle: {
        width: Scale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator_end: {
        width: Scale(20),
        justifyContent: 'flex-start',
        alignItems: 'center',
    },  
    route_duration:{
        color: Colors.blumine,
        marginVertical: Scale(8),
    }
});

AppRegistry.registerComponent("padiciti", () => BusDetil);
