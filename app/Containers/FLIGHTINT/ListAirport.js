import React, { Component } from 'react';
import { AsyncStorage, Text, View, StyleSheet, SectionList, TextInput, Image, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Colors, getIcon } from '../../Assets'
import OriginAirport from '../../Utils/Json'
import { TextView, Toolbar, FrameRadiusComponent } from '../../Components'
import { NavigationActions } from "react-navigation";
import { STRING,Function } from '../../Utils';
import { getURL } from '../../Services/API'
import { JSONGetFile } from '../../Services/JsonService'
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




export default class ListAirport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: [],
            backSection: [],
            search: null,
            loading: false,

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
        this.props.navigation.state.params.ActivityResult({ data: item, slug: params.slug === 'return' ? 'return' : 'depart' })

    }


    componentDidMount() {
        
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
       this.result()
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
    }

    result(){
        const { params } = this.props.navigation.state;
        Section = []
        this.setState({section: [],
            backSection: [],})
        switch (params.slug) {
            case 'depart':
            AsyncStorage.getItem('DEST', (err, DEST) => {
                if (DEST !== null) {
                    this.setState({  section: Function.JsonParse(DEST), backSection: Function.JsonParse(DEST)  })
                } else {
                    this.GetData('url_get_dest')
                }
            })
                break;
            case 'return':
            AsyncStorage.getItem('ORG', (err, ORG) => {
                if (ORG !== null) {
                    this.setState({  section: Function.JsonParse(ORG), backSection: Function.JsonParse(ORG)  })
                } 
                else {
                    this.GetData('url_get_org')
                }
            })

                break;
        }
    }

    handleRefresh = () => {
        const { params } = this.props.navigation.state;
        switch (params.slug) {
            case 'depart':
                Function.DeleteAsyncStorage(['DEST']) 
                this.setState({
                    loading: true
                }, () => {
                    this.result()
                })
                break;
            case 'return':
                Function.DeleteAsyncStorage(['ORG'])
                this.setState({
                    loading: true
                }, () => {
                    this.result()
                })
                break;
        }
    }

    GetData = (type) => {
        this.setState({ loading: true })
        let url =  type === 'url_get_dest'?getURL('url_get_dest'):getURL('url_get_org')
        let parameter = null
        JSONGetFile(url, parameter)
            .then((respone) => {
                switch (respone.respCode) {
                    case '0':

                    respone.airports.map((item, i) => {
                        data.push({ code: item[0], title: item[1], sub_title: item[2], group_code : item[3] })
                    })
                    Section.push({ data, title: 'Semua Kota atau Bandara', })
                            this.setState({ loading: false, section: Section, backSection: Section })
                            if (type === 'url_get_dest'){
                                Function.SaveDataJson('DEST', Function.JsonString(Section))
                            } else {
                                Function.SaveDataJson('ORG', Function.JsonString(Section))
                            }
                            
                        break
                    default:
                    
                    this.setState({ loading: false })
                        break
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                
            

            })
    }

    filterNotes(search, section) {
        var data = []
        var data_section = []
        let text = search.toLowerCase()
        let trucks = this.state.backSection
        let filteredName = trucks.filter((item) => {
            item.data.forEach(function (Item, j) {
                if (Item.title.toLowerCase().match(text)) {
                    
                    data.push(Item)
                }

            })

        })
        data_section.push({ data })
        console.log(data_section)
        this.setState({
            section: []
        }, () => {
            this.setState({
                section: data_section
            })
        })

        if (!text || text === '') {
            this.setState({
                section: this.state.backSection
            })
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noData: true
            })
        } else if (Array.isArray(filteredName)) {
            this.setState({
                noData: false,
                section: this.state.section
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
                                placeholder={STRING.Label.city_name}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.search}
                                onChangeText={search => this.setState({ search: search }, () => { this.filterNotes(this.state.search, this.state.section) })} />
                        </View>
                    }
                    Icon={
                        <View>
                            <TouchableComponent
                                onPress={() => this.setState({ search: null, section: this.state.backSection })} >
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
                    refreshing={this.state.loading}
                    onRefresh={this.handleRefresh}
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