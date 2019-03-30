import React, { Component } from 'react'
import {AsyncStorage,
    TextInput,
    StyleSheet,
    SectionList,
    View,
    Image,
    Platform,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking
} from 'react-native'
import { Colors, Metrics, Toolbar, TextView, Fonts, Touchable } from '../../Components'
import { detinationList } from '../../Services/JSON/DestinationTourList'
import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { STRING,Function } from '../../Utils';
import { getIcon } from '../../Assets';
import { JSONGetFile } from '../../Services/JsonService'
import { getURL } from '../../Services/API'
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}

let tour_list = [
    { title: 'Top Destinations', data: detinationList.cityAll },
    { title: 'All', data: detinationList.cityAll }
]
export default class DestenationTour extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tour_list : tour_list,
            loading: false,
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())

        AsyncStorage.getItem('AllCityTour', (err, AllCityTour) => {
            if (AllCityTour !== null) {
                this.setState({  tour_list: Function.JsonParse(AllCityTour)})
            } 
            else {
                console.log('Loading >>>', AllCityTour)
                this.GetData('url_get_all_city_tour')
            }
        })
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }

    setListbyFilter(search) {
        if (search) {
            search = (search || '').toLowerCase()
            let data   = []
            tour_list[1].data
                .filter((item, index) => {
                    
                    if ( item.city_name.toLowerCase().match(search))
                    data.push(item)
                    console.log(data) 
                })
            this.setState({tour_list:
                data.length !== 0 ? [{ title: '', data }] : [] 
            })
        } else {
            this.setState({tour_list: tour_list})
        }
    }

    setTour = (value) => {
        let { navigation } = this.props
        navigation.goBack()
        navigation.state.params.ActivityResult({ slug: 'destinination', TourList: value })
    }


    GetData = () => {
        this.setState({ loading: true })
        let url = getURL('url_get_all_city_tour')
        let parameter = null
        let data = []
        let arr_item =[]
        JSONGetFile(url, parameter)
            .then((respone) => {
                switch (respone.respCode) {
                    case '0':
                        respone.cityAll.map((item, i) => {
                            arr_item.push(item)
                        })
                        data.push({ title: 'Top Destinations', data: detinationList.cityAll })
                        data.push({ title: 'All', data: arr_item })
                        this.setState({ loading: false, tour_list: data})
                        Function.SaveDataJson('AllCityTour', Function.JsonString(data))
                        break
                    default:

                        this.setState({ loading: false })
                        break}
            }).catch((error) => {
                this.setState({ loading: false })
            })
    }

    handleRefresh = () => {
        this.setState({
            loading: true,
        }, () => {
            this.GetData('url_get_all_city_tour')
        })
    }

    render() {
        return (
            <View style={{ backgroundColor: '#4778fb', }} >

                <Toolbar
                    arrow_back
                    style={{ backgroundColor: 'transparent' }}
                    onPress={() => this.backAndroid()}
                    View={<TextView
                        style={styles.lableTitle}
                        text={"Search"}
                    />}
                />
                <View style={{ marginLeft: Scale(16), marginRight: Scale(16), height: Scale(40), borderRadius: Scale(20), backgroundColor: "#ffffff", flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        style={{ marginLeft: Scale(8), marginRight: Scale(8), width: Scale(24), height: Scale(24) }}
                        resizeMode='contain'
                        source={getIcon('ic_search')} />
                    <TextInput
                        style={{ flex: 1, marginRight: Scale(8) }}
                        placeholder={'Search destination, city or place, activity'}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={null}
                        onChangeText= {search => this.setState({search}, () => this.setListbyFilter(search))}/>
                </View>

                <View style={{ height: Metrics.screenHeight, marginTop: Scale(16), borderTopLeftRadius: Scale(16), borderTopRightRadius: Scale(16), backgroundColor: Colors.white }}>

                    <SectionList
                        renderItem={({ item, index, section }) =>
                            <ItemTour
                                key={index}
                                code={item.city_code}
                                name={item.city_name}
                                onPress={() => this.setTour(item)} />
                        }
                        renderSectionHeader={({ section: { title } }) => <ItemHeader title={title} />}
                        sections={this.state.tour_list}
                        keyExtractor={(item, index) => item + index}
                        ItemSeparatorComponent={ItemSeparator}
                        refreshing={this.state.loading}
                        onRefresh={this.handleRefresh}
                        ListEmptyComponent={() => <EmptyList />}
                    />

                </View>
            </View>


        );
    }
}

const ItemSeparator = () => <View style={{ height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: Colors.border }} />

const ItemTour = props =>
    <Touchable
        onPress={props.onPress} >
        <View style={styles.item_frame}>
            <TextView style={styles.item_name}>{props.name}</TextView>
        </View>
    </Touchable>

const EmptyList = () => {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: Scale(16)
        }}>
            <TextView style={{
                fontSize: Scale(16)
            }}>{STRING.Label.notfound_data}</TextView>
        </View>
    )
}
const ItemHeader = props => <View>
    <TextView style={styles.item_header}>{props.title}</TextView>
    <View style={{ height: Scale(1), backgroundColor: '#eeeeee' }} />
</View>



const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(18), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(16),
        bottom: Scale(8),
        color: Colors.blue
    },
    item_header: {
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
        // backgroundColor: Colors.concrete,
        fontSize: Scale(14),
        color: '#666666'
    },
    item_frame: {
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
    },
    item_name: {
        fontSize: Fonts.size.regular,
        color: Colors.black
    },
    item_code: {
        fontSize: Fonts.size.small,
        color: Colors.warm_grey,
    },
});
AppRegistry.registerComponent("padiciti", () => DestenationTour);
