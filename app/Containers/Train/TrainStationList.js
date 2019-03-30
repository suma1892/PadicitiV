import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    SectionList,
    TextInput,
    ActivityIndicator
} from 'react-native'
import {
    TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Touchable,
    Icon,
    getIcon
} from '../../Components/'
import  {stationList} from '../../Services/JSON/StationsList'
import { STRING } from '../../Utils';
// let stationList = require('./customData.json');
// Dummy Schedule

let station_list = [
    { title: 'Stasiun Kereta Populer', data : stationList.popular },
    { title: 'Indonesia', data : stationList.origination}
]

export default class TrainStationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stationList : station_list,
            slug        : this.props.navigation.state.params.slug || 'origination',
            search      : ''
        }
    }

    setStation = (value) => {
        let { navigation } = this.props
        navigation.goBack()
        navigation.state.params.ActivityResult({slug: this.state.slug, stationList: value})
    }

    setListbyFilter(search) {
        if (search) {
            search = (search || '').toLowerCase()
            let data   = []
            station_list[1].data
                .filter((item, index) => {
                    if ( item[0].toLowerCase().match(search) || item[1].toLowerCase().match(search))
                        data = [...data, [...item]]
                })
            this.setState({stationList:
                data.length !== 0 ? [{ title: 'Indonesia', data }] : [] 
            })
        } else {
            this.setState({stationList: station_list})
        }
    }

    render() {
        return (
            <View style={s.container} >
                <Toolbar  
                    arrow_back
                    onPress ={ () => this.props.navigation.goBack()}>
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <TextInput
                            placeholder = {STRING.Label.station_name}
                            value       = {this.state.search}
                            onChangeText= {search => this.setState({search}, () => this.setListbyFilter(search))}
                            style       = {s.filter_search}
                            underlineColorAndroid='rgba(0,0,0,0)'
                         />
                         <Icon 
                            size    ={'normal'} 
                            source  ={getIcon('ic_round_cancel')} 
                            style   ={s.icon_switch} 
                            onPress ={() => this.setState({search: ''}, () => this.setListbyFilter(''))}/>
                    </View>
                </Toolbar>
                <SectionList
                    renderItem={({item, index, section}) => 
                        <ItemStation 
                            key     ={index} 
                            code    ={item[0]} 
                            name    ={item[1]}
                            onPress ={() => this.setStation(item)}/>
                    }
                    renderSectionHeader={({section: {title}}) => <ItemHeader title={title} />}
                    sections={this.state.stationList}
                    keyExtractor={(item, index) => item + index}
                    ItemSeparatorComponent={ItemSeparator} 
                    ListEmptyComponent={() => <EmptyList/>}
                    />
                {/* <FlatList
                    data={this.state.stationList}
                    renderItem={({item, index}) => (
                        <ItemStation code={item[0]} title={item[1]}/>   
                    )}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={ItemSeparator} 
                    /> */}
            </View>
        )
    }
}


const ItemSeparator = () => <View style={{height: StyleSheet.hairlineWidth, flex:1, backgroundColor: Colors.border}}/>

const ItemStation = props => 
    <Touchable
        onPress={props.onPress} >
        <View style={s.item_frame}>
            <Text style={s.item_name}>{props.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</Text>
            <Text style={s.item_code}>{props.code} - {(props.name).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</Text>
        </View>
    </Touchable>

const EmptyList = () => {
    return (
        <View style={{
            flex:1, 
            justifyContent:'center', 
            alignItems: 'center',
            padding: Scale(16)}}>
            <Text style={{
                fontSize: Scale(16)
            }}>{STRING.Label.notfound_data}</Text>
        </View>
    )
}
const ItemHeader = props => <Text style={s.item_header}>{props.title}</Text>

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
    item_frame:{
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
    },
    item_name:{
        fontSize: Fonts.size.regular,
        color: Colors.black
    },
    item_code:{
        fontSize: Fonts.size.small,
        color: Colors.warm_grey,
    },
    item_header:{
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
        backgroundColor: Colors.concrete,
        fontSize: Fonts.size.medium,
        color: Colors.blumine
    },
    filter_search:{
        backgroundColor: Colors.white,
        padding: Scale(8),
        borderRadius: Scale(5),
        marginRight: Scale(8),
        flex:1
    }
})

AppRegistry.registerComponent("padiciti", () => TrainStationList);
