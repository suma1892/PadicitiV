import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView
} from 'react-native'
import {
    TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Touchable,
} from '../../Components/'
import { sort_list, filter_time, filter_class } from '../../Services/JSON/Sort_Filter'
import { find_duplicate_in_array } from '../../Utils/TrainUtils'

export default class TrainSortFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_value  : null,
            class_value : null,
            train_value : null,
            sort_value  : null
        }
    }
    

    componentDidMount() {
        let { params } = this.props.navigation.state
        this.setStateSafe({
            sort_value  : params.sort_value || 'price_asc',
            time_value  : params.time_value,
            class_value : params.class_value,
            train_value : params.train_value,
        })
    }
    
    setStateSafe = this.setState

    render() {
        const { navigation } = this.props
        const { state, goBack } = navigation
        let { time_value, class_value, train_value } = this.state

        return (
            <View style={s.container}>
                <Toolbar  
                    arrow_back
                    onPress ={ () => goBack()}>
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <Text style ={s.toolbar_title}>Urutkan</Text>

                        {state.params && state.params.slug === 'filter' &&
                            <Touchable onPress={() => this.setState({time_value: null, class_value: null, train_value: null})}>
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
                                navigation.goBack()
                                navigation.state.params.ActivityResult({slug: 'sort', value: item.slug })
                            })}
                            title   ={item.title}
                            subtitle={item.subtitle}
                            slug    ={item.slug}
                            active  ={this.state.sort_value === item.slug} />
                    ))}
                </ScrollView>}
                
                {state.params && state.params.slug === 'filter' && <ScrollView>
                    <Text style={s.title_section}>Waktu</Text>
                    {filter_time.map((item, index) => (
                            <ItemListCheckBox 
                                key     = {index}
                                onPress ={() => this.setState({time_value: item.slug})}
                                title   ={item.title}
                                subtitle={item.subtitle}
                                slug    ={item.slug}
                                active  ={this.state.time_value === item.slug} />
                        ))}
                    <Text style={s.title_section}>Kelas</Text>
                    {filter_class.map((item, index) => (
                            <ItemListCheckBox 
                                key     = {index}
                                onPress ={() => this.setState({class_value: item.slug})}
                                title   ={item.title}
                                subtitle={item.subtitle}
                                slug    ={item.slug}
                                active  ={this.state.class_value === item.slug} />
                        ))}
                    <Text style={s.title_section}>Nama Kereta</Text>
                    {find_duplicate_in_array(state.params.train_name).map((item, index) => (
                            <ItemListCheckBox 
                                key     = {index}
                                onPress ={() => this.setState({train_value: item.name})}
                                title   ={item.name}
                                subtitle={item.subtitle}
                                slug    ={item.name}
                                active  ={this.state.train_value === item.name} />
                        ))}
                </ScrollView>}

                {state.params && state.params.slug === 'filter' && 
                    <Touchable onPress={() => {
                        navigation.goBack()
                        navigation.state.params.ActivityResult({slug: 'filter', time_value, class_value, train_value})
                        }}>
                        <View style={s.btn_apply}>
                            <Text style={s.btn_apply_txt}>Apply</Text>
                        </View>
                    </Touchable>}

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
