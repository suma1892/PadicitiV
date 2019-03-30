import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    FlatList,
    View,
    Image,
    Platform,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking
} from 'react-native'
import { Colors, Metrics, Toolbar, TextView, Fonts, Touchable, Alert } from '../../Components'
import { detinationList } from '../../Services/JSON/DestinationTourList'
import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { STRING, Function } from '../../Utils';
import { getIcon } from '../../Assets';
import { JSONGetFile } from '../../Services/JsonService'
import { getURL } from '../../Services/API'
import { ListHotel } from '../../Utils/dummy';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}

export default class ListTour extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tour_list: [],
            loading: false,
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        this.handleRefresh()
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }
    getCategoryTour(category){
        var i =0
        var Category = ''
        while (i<category.length){
            Category += category[i].namePaket+ (i !== category.length ? ', ':'')
            i++
        }
        return Category
    }

    LoopTourCategory(msTourCategory){
        var Category =""
        for (let MsTourCategory of msTourCategory) { 
            Category +=MsTourCategory.catagoryName + ", "
            
          }
          console.log("Ininiin >>" +Category)
return Category
         
    }

    GetData = () => {
        const {params} = this.props.navigation.state;
        this.setState({ loading: true })
        console.log(params.data.date)
        let parameter = {city : params.data.destinination.city_code !== '0' ?  params.data.destinination.city_name : '', day : Function.FormeteDate(params.data.date, 'DD MMM YYYY', 'DD'), month_year : Function.FormeteDate(params.data.date, 'DD MMM YYYY', 'MMYYYY')}
        let url = getURL('url_get_inqwery_tour', parameter)
        JSONGetFile(url, parameter)
            .then((respone) => {
               
                switch (respone.respCode) {
                    case '0':
                    console.log(respone.tour)
                    this.setState({loading: false, tour_list : [...this.state.tour_list,...respone.tour]})
                        break
                    default:

                        this.setState({ loading: false }, () =>{
                            Alert('Data tidak di temukan silakan cobalagi')
                        })
                        break
                }
            }).catch((error) => {
                this.setState({ loading: false }, () =>{
                    Alert(STRING.Warrning.no_connection)
                })
            })
    }

    handleRefresh = () => {
        this.setState({
            loading: true,
            tour_list: []
        }, () => {
            this.GetData()
        })
    }

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={{ backgroundColor: '#4778fb', }} >

                <Toolbar
                    arrow_back
                    style={{ backgroundColor: 'transparent' }}
                    onPress={() => this.backAndroid()}
                    View={
                        <View>
                            <TextView
                                style={styles.lableTitle}
                                text={params.data.destinination.city_name}
                            />

                            {/* <TextView
                                style={{ fontSize: Scale(14), color: Colors.white }}
                                text={Function.FormeteDate(params.data.date, 'DD MMM YYYY', 'DD MMMM YYYY')}
                            /> */}
                        </View>}
                />
                <View style={{ height: Metrics.screenHeight, marginTop: Scale(8), borderTopLeftRadius: Scale(16), borderTopRightRadius: Scale(16), backgroundColor: '#f5f5f5', paddingHorizontal: Scale(6) }}>
                    {this.state.tour_list.length !==0 && <TextView
                        style={{ marginLeft: Scale(8), marginTop: Scale(8), fontSize: Scale(14), color: '#666666' }}
                        text={this.state.tour_list.length + " tours available"}
                    />}
                    <FlatList
                        style={{ marginBottom: Scale(80), marginTop: Scale(16) }}
                        data= {this.state.tour_list}
                        refreshing={this.state.loading}
                        onRefresh={this.handleRefresh}
                        keyExtractor={(item, index) => `key-${index}`}
                        renderItem={({ item, index }) => (

                           <ListCardTour
                           onPress ={() => this.props.navigation.navigate('DetilTour',{idTour : item.idTour, date : params.data.date, destinination : params.data.destinination})}
                           image = {item.msTourImage[0].imageUrl}
                           name = {item.nameTour}
                           star = {item.rating}
                           destination = {item.nameCity}
                           title_1= {item.keyword}
                            price = {Function.convertToPrice(item.price)}
                           />
                        )} />
                </View>
            </View>


        );
    }
}


const ListCardTour = props =>(
    <Touchable
        onPress={props.onPress} >
    <View style={{ borderRadius: Scale(8), backgroundColor: Colors.white, marginVertical: Scale(2), height: Scale(170), flexDirection: 'row' }}>
    <View style={{ width: Scale(135) }}>
        <Image
            source={{ uri: props.image }}
            resizeMode='cover'
            style={{ borderTopLeftRadius: Scale(8), borderBottomLeftRadius: Scale(8), width: Scale(150), height: Scale(170) }}
        />
    </View>

    <View style={{ width: Metrics.screenWidth - Scale(135), padding: Scale(20) }}>

        <TextView
            style={{ fontSize: Scale(14), color: Colors.black, fontWeight: '500' }}
            text={props.name} />

        <View style={{ flexDirection: 'row', marginTop: Scale(4) }}>
            {
                Array.from({ length: props.star }).map((_, i) =>
                    <Image
                        key={i}
                        source={getIcon('ic_star')}
                        style={{ height: Scale(13), width: Scale(13) }}
                        resizeMode='contain'
                    />)}
        </View>

        <TextView
            style={{ marginTop: Scale(4), fontSize: Scale(12), color: '#aaaaaa', fontWeight: '500' }}
            text={props.destination} />

    

        {props.title_1.length !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
            <View style={{ width: Scale(53), height: Scale(25), borderRadius: Scale(12.5), borderStyle: "solid", borderWidth: Scale(1), borderColor: "#dddddd", alignItems: 'center', justifyContent: 'center' }}>
                <TextView
                    style={{ fontSize: Scale(11), color: '#aaaaaa', fontWeight: '500' }}
                    text={props.title_1[0].keywordName} />
            </View>

            {props.title_1.length > 1 && <View style={{ marginLeft: Scale(8), marginRight: Scale(8), width: Scale(53), height: Scale(25), borderRadius: Scale(12.5), borderStyle: "solid", borderWidth: Scale(1), borderColor: "#dddddd", alignItems: 'center', justifyContent: 'center' }}>
                <TextView
                    style={{ fontSize: Scale(11), color: '#aaaaaa', fontWeight: '500' }}
                    text={props.title_1[1].keywordName} />
            </View>}

           {props.title_1.length >= 3 && <View style={{ width: Scale(53), height: Scale(25), borderRadius: Scale(12.5), borderStyle: "solid", borderWidth: Scale(1), borderColor: "#dddddd", alignItems: 'center', justifyContent: 'center' }}>
                <TextView
                    style={{ fontSize: Scale(11), color: '#aaaaaa', fontWeight: '500' }}
                    text={props.title_1[2].keywordName} />
            </View>}
       </View> }

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TextView
                style={{ fontSize: Scale(16), color: '#00c783', fontWeight: '500' }}
                text={'IDR ' + props.price} />

        </View>

    </View>


</View>
</Touchable>
)

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(16), color: Colors.white
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
AppRegistry.registerComponent("padiciti", () => ListTour);
