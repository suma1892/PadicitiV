import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, 
    Platform, WebView,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking 
} from 'react-native'
import {Colors, Metrics, Toolbar, TextView, Modal } from '../../Components'

import {NavigationActions } from 'react-navigation';
import moment from 'moment'
import {Function, navigateTo} from '../../Utils'
import {getIcon } from '../../Assets';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class TourReservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visibleModal : false,
            duration : 0,
            add_duration : 0,
            destinination : {city_code:"0",
            city_name:"All Destination Tour"},
            date : Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'DD MMM YYYY'),
            error_color : {
                error_color_date : null,
                error_color_dest : null
            },
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('SearchTour', (err, SearchTour) => {
            if (SearchTour !== null) {
                let history_search = Function.JsonParse(SearchTour)
           this.setState({
                    destinination : history_search.destinination,
                    date : history_search.date,
                })
            }
        })
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())

    }

    ActivityResult = (data) => {
        switch (data.slug) {
            case 'destinination':
                this.setState({ destinination: data.TourList })
                break
            case 'depart_date':
                var value_depart_date = Function.FormeteDate(data.depart_date, "YYYY-MM-DD", 'DD MMM YYYY')
                this.setState({ date: value_depart_date})
                break
        }
    }
   
    backAndroid() {
        navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
        return true
    }

    NextPage(){
        this.setState({ error_color : {
            error_color_date : null,
            error_color_dest : null
        }})

        // if (!this.state.destinination){
        //     this.setState({ error_color : {
        //         error_color_dest : Colors.red
        //     }})
        // } else 
        if ( !this.state.date ){
            this.setState({ error_color : {
                error_color_date : Colors.red
            }})
        } else {
            Function.SaveDataJson('SearchTour', Function.JsonString({date : this.state.date, destinination : this.state.destinination}))
            this.props.navigation.navigate('ListTour', { data: this.state, date : this.state.date, destinination : this.state.destinination })
        }
    }

    render() {
        
        return (
            <View style={styles.frame} >
                <View style={{ width : Metrics.screenWidth, height: Scale(150), backgroundColor: '#3b65d6', marginBottom : Scale(16) }} >
                    <Image
                        source={getIcon('layer_1')}
                        resizeMode={'stretch'}
                        style={{
                            position: 'absolute', 
                            width: Metrics.screenWidth,
                            height: Scale(145),
                            tintColor: '#4778fb'
                        }}/>

                    <Toolbar
                        arrow_back
                        style={{ backgroundColor: 'transparent' }}
                        onPress={() => this.backAndroid()}
                        View={<TextView
                                style={styles.lableTitle}
                                text={"Search Tour"}
                            />}
                    />
                    <TouchableComponent onPress={() => this.props.navigation.navigate('DestenationTour', {slug : 'destinination', ActivityResult : this.ActivityResult })}>
                    <View style={{ marginLeft: Scale(16), paddingRight : Scale(16) }} >
                        <TextView style={{ fontSize: 11, color: "#bacdff" }}> Let’s find your journey </TextView>

                        <TextView style={{fontSize: Scale(20), color: "#ffffff" }}>{this.state.destinination ?this.state.destinination.city_code !== '0' ? this.state.destinination.city_name : 'Destination, activities and interests' : 'Destination, activities and interests'}</TextView>
                        <View style={{marginTop : Scale(4), height : Scale(1), backgroundColor : this.state.error_color.error_color_dest ? this.state.error_color.error_color_dest : Colors.white }} />
                    </View>
                    </TouchableComponent>
                </View>
                {/* <InputText
                    image={'ic_depart_date'}
                    error = {this.state.error_color.error_color_date}
                    title={this.state.date ?this.state.date : 'Month of departure'}
                    onPress ={() => this.props.navigation.navigate('CalendarScreen', { depart_date:  this.state.date, slug: 'depart_date', ActivityResult: this.ActivityResult })}
                /> */}
                {/* <InputText
                    image={'ic_depart_date'}
                    title={this.state.duration === 0 ? 'Duration Day' : this.state.duration}
                    onPress ={() => this.setState({visibleModal : true, add_duration :  this.state.duration })}
                /> */}

                 {(this.state.error_color.error_color_dest || this.state.error_color.error_color_date)  && <TextView style={{ paddingTop: Scale(12), paddingLeft : Scale(8), paddingRight : Scale(8), fontSize: Scale(12), color: Colors.red }}>{'Harap lengkapi data untuk melakukan pencarian'}</TextView>}

                <Button
                onPress ={() => this.NextPage()}/>
                
                <AddParcipant
                active = {this.state.visibleModal}
                done ={() => this.setState({visibleModal : false, duration : this.state.add_duration})}
                close ={() => this.setState({visibleModal : false})}
                onClose = {value  => this.setState({ visibleModal: value })}
                value ={this.state.add_duration}
                minus = {() => this.setState({add_duration : this.state.add_duration !== 0 ? this.state.add_duration - 1 : this.state.add_duration })}
                plus ={() => this.setState({add_duration : this.state.add_duration + 1})}
                />                
            </View>
            

        );
    }
}

const InputText = props => (
    
    <View style={{ marginTop: Scale(8), backgroundColor: '#f7f7f7' }} >
        <TouchableComponent onPress={props.onPress}>
            <View style={{ marginLeft: Scale(16), marginRight: Scale(16) }}>

                <View style={{ padding: Scale(8), height: Scale(50), borderRadius: Scale(6), backgroundColor: "#ffffff", flexDirection: 'row', alignItems: 'center' }} >
                    <Image
                        source={getIcon(props.image)}
                        resizeMode={'contain'}
                        tintColor = {props.error}
                        style={{
                            width: Scale(20), height: Scale(20),
                        }}
                    />
                    <TextView style={{ marginLeft: Scale(8), fontSize: 14, color: "#dddddd" }}>{props.title}</TextView>
                </View>
            </View>
        </TouchableComponent>
    </View>
)

const Button = props => (
    
    <View style={{marginTop : Scale(16),marginLeft: Scale(16), marginRight: Scale(16), marginTop: Scale(20)}} >
        <TouchableComponent onPress={props.onPress}>
            <View style={{ height: Scale(50), borderRadius: Scale(29.5), backgroundColor: "#00c783", justifyContent : 'center', alignItems : 'center' }}>
                    <TextView style={{ marginLeft: Scale(8), fontSize: 14, color: "#ffffff" }}>{'SEARCH TOUR'}</TextView>
               
            </View>
        </TouchableComponent>
    </View>

)

const AddParcipant = props => (
    <Modal
                    style={{ borderTopLeftRadius: Scale(16), borderTopRightRadius: Scale(16) }}
                    type={'more'}
                    active={props.active}
                    onClose={props.onClose}
                >

                    <View style={{ height: Scale(141), borderTopLeftRadius: Scale(16), borderTopRightRadius: Scale(16), backgroundColor: "#ffffff" }}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableComponent onPress={props.close}>
                    <View style={{ padding: Scale(16) }}>
                        <Image
                            source={getIcon('ic_close')}
                            resizeMode={'contain'}
                            style={{ width: Scale(12), height: Scale(12), tintColor: '#00c783' }}
                        />
                    </View>
                </TouchableComponent>

                <TextView style={{ marginLeft: Scale(8), marginTop: Scale(12), fontSize: 16, color: "#000000" }}>{'Duration'}</TextView>
                <TouchableComponent onPress={props.done}>
                    <View style={{ width: Metrics.screenWidth / 1.5, alignItems: 'flex-end' }}>
                        <TextView style={{ marginTop: Scale(12), fontSize: Scale(16), color: "#00c783" }}>{'DONE'}</TextView>
                    </View>
                </TouchableComponent>
            </View> 

                        <View style={{ padding: Scale(16), flexDirection: 'row',}}>
                            <TextView style={{ marginTop: Scale(12), fontSize: Scale(16), color: "#000000" }}>{'Duration Tour'}</TextView>

                            <View style={{flex: 1,  flexDirection: 'row', justifyContent : 'flex-end'}}>
                            <TouchableComponent onPress={props.minus}>
                                <Image
                                    source={getIcon('ic_group_minus')}
                                    resizeMode={'contain'}
                                    style={{ marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                />
                                </TouchableComponent>
                                <TextView style={{ paddingTop: Scale(12), paddingLeft : Scale(8), paddingRight : Scale(8), fontSize: Scale(18), color: "#000000" }}>{props.value.toString()}</TextView>
                                <TouchableComponent onPress={props.plus}>
                                <Image
                                    source={getIcon('ic_group_plus')}
                                    resizeMode={'contain'}
                                    style={{ marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                />
                                </TouchableComponent>
                            </View>
                        </View>
                    </View>


                </Modal>
)

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
    }
});
AppRegistry.registerComponent("padiciti", () => TourReservation);
