import React, { Component } from 'react';
import { Text, View, StyleSheet, SectionList, TextInput, Image, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Colors, getIcon } from '../../Assets'
import Destinination from '../../Utils/Json'
import { API, getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile } from '../../Services/JsonService'
import { TextView, Toolbar, FrameRadiusComponent } from '../../Components'
import { NavigationActions } from "react-navigation";
import { STRING } from '../../Utils';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback
function keyExtractor(item) {
    return item.title
}

var Section = []
var data = []

const renderSectionHeader = ({ section }) =>
    section.title && <View style={styles.sectionContainer}>
        <TextView style={styles.sectionTitle}>{section.title}</TextView>
    </View>




export default class ListHotelDestination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter : [{findData: null},
            {languageCode : 'ID'}],
            section: [],
            backSection: [],
            search: null,

        }
    }


    renderItem = ({ item }) => {
        return (<TouchableComponent
            onPress={() => this.Onpres(item)} >
            <View style={styles.sectionContainerItem}>
                <TextView style={styles.lable_one}>{item.title}</TextView>
                <TextView style={styles.lable_two}>{item.sub_title}</TextView>
            </View>
        </TouchableComponent>)
    }

    Onpres(item) {
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ data: item, slug: 'destination'})

    }


    componentDidMount() {
        const { params } = this.props.navigation.state;
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        data = []
        Section = []
        this.setState({section: [],
            backSection: [],})

            // this.Auth()
            var JsonDestinination = JSON.parse(JSON.stringify(Destinination.JsonDestinination()))
            JsonDestinination.groupList.map((item, i) => {
                item.destDetail.map((destDetailitem, i) => {
                    
                     data.push({ code: destDetailitem.valueCode, groupCode : item.groupCode, title: destDetailitem.valueName, sub_title: destDetailitem.paxHotel +" Hotel" })
                     
                 })
            })
            Section.push({ data, title: 'Destinasi Populer', })
            this.setState({ section: Section, backSection: Section })
    }   

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
    }

    Auth=(text)=> {
        data = []
        Section = []
                try {
                    const { params } = this.props.navigation.state;

                    this.setState({ loading: true })
                    let url = getURL('url_post_hotel_destination_by_param')
                    let parameter = Parameter.DestHotel(text)

                    JSONPostFile(url, parameter).then((Respone) => {
                        console.log(Respone)
                        var count = this.state.groupFlight ? this.state.groupFlight.length : 0
                        switch (Respone.respCode) {
                            case '0':
                            
                            var JsonDestinination = Respone.groupList
                            JsonDestinination.map((item, i) => {
                                item.destDetail.map((destDetailitem, i) => {
                                    
                                     data.push({ code: destDetailitem.valueCode,  groupCode : item.groupCode, title: destDetailitem.valueName, sub_title: destDetailitem.paxHotel +" Hotel" })
                                     
                                 })
                            })
                            Section.push({data})
                            this.setState({section: Section})
                                break
                            default:
                            console.log('Masuk >>> ')
                            console.log(Respone)
                                break
                        }

                    }).catch((err) => {
                        console.log('err >>> ' + err)
                    })
                } catch (Error) {
                    console.log('Error >>> ', Error)
                   
                }
                // break
        //     default:
        //         // console.log('putus')
        //         // this.setState({ count: 0.0 })
        //         break;
        // }


    }


    filterNotes(search, section) {
        data = []
        Section = []
        let text = search.toLowerCase()
        let trucks = this.state.backSection
        

        if (!text || text === '') {
            Section = trucks
            console.log('ininininini Text kosong')
            this.setState({section : []}, ()=>{
                this.setState({section : Section})
            })
           
        }else  {
            this.setState({section : []}, () =>{
                this.Auth(text)
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    arrow_back
                    onPress={  () => this.backAndroid()}
                    View={
                        <View style={styles.search_frame}>

                            <TextInput
                                style={{ padding: 8 }}
                                placeholder={STRING.Label.hotel_name}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.search}
                                
                                onChangeText={search => this.setState({ search: search }, () => { this.filterNotes(this.state.search, this.state.section) })} />
                        </View>
                    }
                    Icon={
                        <View>
                            <TouchableComponent
                                onPress={() => this.setState({ search: null, section: []}, ()=>{this.setState({section: this.state.backSection})})} >
                                <View style={styles.oval}>

                                    <Image
                                        style={[styles.ic_close]}
                                        resizeMode='contain'
                                        source={getIcon('ic_close')}
                                    />

                                </View>
                            </TouchableComponent>
                        </View>
                    }
                />
                <SectionList
                    keyExtractor={keyExtractor}
                    renderSectionHeader={renderSectionHeader}
                    renderItem={this.renderItem}
                    sections={this.state.section}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    sectionContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        height: 40,
        justifyContent: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: '#f2f2f2',
    },
    sectionTitle: {
        color: '#204a8b',
        fontSize: 14,
        opacity: 0.8,
    },
    sectionContainerItem: {
        paddingLeft: 8,
        paddingRight: 8,
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: Colors.white,
    },
    lable_one: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.black
    },
    lable_two: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.warm_grey
    }, search_frame: {
        flex: 1,
        height: 30,
        marginLeft: 6,
        borderRadius: 6,
        justifyContent: 'center',
        backgroundColor: "#f2f2f2"
    },
    oval: {
        width: 26,
        height: 26,
        marginLeft: 8,
        borderRadius: 30,
        backgroundColor: Colors.tangerine,
        justifyContent: 'center',
        alignItems: 'center'
    }, ic_close: {
        width: 6.2,
        position: 'absolute',
        height: 7
    }

});

const SECTIONS = [
    {
        data: [
            {
                title: 'List Item 1',
            },
            {
                title: 'List Item 2',
            },
            {
                title: 'List Item 3',
            },
            {
                title: 'List Item 4',
            },
        ],
        title: 'SECTION 1',
    },
    {
        data: [
            {
                title: 'List Item 1',
            },
            {
                title: 'List Item 2',
            },
            {
                title: 'List Item 3',
            },
            {
                title: 'List Item 4',
            },
        ],
        title: 'SECTION 2',
    },
    {
        data: [
            {
                title: 'List Item 1',
            },
            {
                title: 'List Item 2',
            },
            {
                title: 'List Item 3',
            },
            {
                title: 'List Item 4',
            },
        ],
        title: 'SECTION 3',
    },
    {
        data: [
            {
                title: 'List Item 1',
            },
            {
                title: 'List Item 2',
            },
            {
                title: 'List Item 3',
            },
            {
                title: 'List Item 4',
            },
        ],
        title: 'SECTION 4',
    },
]