import React, { Component } from 'react'
import {
    Animated,
    StatusBar,
    StyleSheet,
    Platform,
    View,
    Image,
    TextInput,
    Text
} from 'react-native'
import { Metrics, Fonts , Colors} from '../Assets/index'
import { getIcon, Scale, Touchable, Container} from '../Components/index'
import Modal                        from 'react-native-modal'
const   
    BACKGROUND_COLOR = '#204A8B',
    IS_IOS           = Platform.OS === 'android' ? 0 : 20,
    TOOLBAR_HEIGHT   = Platform.OS === 'android' ? 56 : 56,
    ICON_COLOR       = 'white',
    ICON_SIZE        = 24,
    TITLE_SIZE       =  18,
    TITLE_COLOR      = 'white',
    SUBTITLE_SIZE    = 14,
    SUBTITLE_COLOR   = 'white'

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            searchText: this.props.searchBar || null,
            searchBar: new Animated.Value(0),
        })
      }

    // _openSearch = (value) => {
    //     if(value) {
    //         Animated.timing(this.state.searchBar, { toValue: 10 }).start()
    //         this.textinput.focus()
    //     } else {
    //         Animated.timing(this.state.searchBar, { toValue: 0 }).start()
    //         this.textinput.blur()
    //     }
    // }
    _onClose() {
        this.props.onPressClose();
    }
    _onPressSearchClose() {
        this.props.onPressSearchClose();
    }

    _onPressAdd() {
        this.props.onPressAdd();
    }
      
    render() {
        const opacity1    = this.state.searchBar.interpolate({ inputRange: [0, 1],outputRange: [1, 0]})
        const opacity2    = this.state.searchBar.interpolate({ inputRange: [0, 3],outputRange: [0, 1]});
        // const searchInput = this.state.searchBar.interpolate({ inputRange: [0, 10], outputRange: [Metrics.screen.width, 0]})
        const {props}         = this,
              statusBarBG   = Platform.OS === 'android' && Platform.Version >= 23 ? 'white' : 'white',
              statusBarBS   = Platform.OS === 'android' && Platform.Version >= 23 ? 'dark-content' : 'default',
              toolbarStyle  = [
                        s.toolbarView, 
                        props.style       && props.style
                        ]

        return (
            <Container style={[toolbarStyle]}>
                <StatusBar backgroundColor={statusBarBG} barStyle={statusBarBS} />
                <View style={[s.contentToolbar, ...props.style || {}]}>
                    {props.left && props.left.map((item, i) => 
                    <ToolbarIcon  light={props.light}  key={i} {...item} />)}
                    <Animated.View style={[s.ViewTitle, !props.left && {left: Metrics.padding.normal}, !props.right && {marginRight: Metrics.padding.normal}, this.props.centerTitle && {alignItems:'center'}]}>
                        <Animated.View style={[{justifyContent: 'flex-end'} ]}>
                            {props.subtitle && 
                                <Text style={[s.subtitleStyle, ...props.subtitleStyle || {}]} 
                                ellipsizeMode='tail'
                                numberOfLines={1}>{props.subtitle}</Text>}
                            {props.title !== "" &&
                                <Text style={[s.titleStyle, ...props.titleStyle || {}]}
                                ellipsizeMode='tail'
                                numberOfLines={1} >{props.title ? props.title : null}</Text>}
                        </Animated.View>
                        {this.props.searchBar && 
                            <Animated.View style={[s.searchBar]}>
                                   <View style={s.search_frame}>
                                        <TextInput
                                            style       = {[s.input_search, {fontSize : Fonts.size.small}]}
                                            placeholder={props.placeholder}
                                            underlineColorAndroid='rgba(0,0,0,0)'
                                            //value={this.state.search}
                                            onChangeText= {searchText => this.setState({searchText}, () => this.props.searchBar(this.state.searchText))}
                                        />
                                    </View>
                                    <View>
                                        <Touchable onPress={this._onPressSearchClose()}>
                                            <View style={s.oval}>
                                                <Image
                                                    style={[s.ic_close]}
                                                    resizeMode='contain'
                                                    source={getIcon('ic_close')}
                                                />

                                                </View>
                                        </Touchable>
                                    </View>
                                
                        </Animated.View>}
                    </Animated.View>
                    
                    {props.right && props.right.map((item, i) => <ToolbarIcon light={props.light}  key={i} {...item} />)}
                    {props.close && 
                        <Touchable onPress={this.props.onPressReset}>
                            <View style={[s.close,{}]}>
                                    <Text style={[s.itemClose,{color: Colors.tangerine}]}>Reset</Text>
                            </View>
                        </Touchable>
                    } 
                    {props.add && 
                        <Touchable onPress={this._onPressAdd()}>
                            <View style={s.addContainer}>
                                    <Text style={s.itemAdd}>+Add</Text>
                            </View>
                        </Touchable>
                    } 
                </View>
            </Container>
        )
    }
}


Toolbar.defaultProps = {
    transparent     : false,
    hairline        : false,
    shadow          : true,
}

class ToolbarIcon extends Component {
    constructor() {
        super()
        this.state = {
            context: false,
        }  
    }
    render() {
        const {props} = this
        return (
            <Animated.View style={[s.IconToolbar, props.style && {...props.style}]}>
                    
                <Touchable onPress={() => { 
                        props.context && this.setState({context:true}); 
                        props.onPress()
                        }}>
                    <Image style={[s.Icon]} resizeMode='contain' source={getIcon(props.icon || '')}/>
                </Touchable>
                {props.context && 
                    <Modal 
                        animationIn     ="fadeIn"
                        animationOut    ="fadeOut"
                        backdropOpacity ={0}
                        avoidKeyboard   ={true}
                        onRequestClose  ={() => console.log('Context has Close')}
                        onBackdropPress ={() => this.setState({context:false})}
                        isVisible={this.state.context}>
                        <Animated.View style={[s.context, s.contextRight, s.shadow]}>
                            { props.context.map((item, i) => ( 
                                <Touchable key ={i} onPress={() => { this.setState({context:false}, () => item.onPress) }}>
                                    <Text style={s.itemContext}>{item.text}</Text>
                                </Touchable>
                                ))
                            }
                        </Animated.View>
                    </Modal>
                }
            </Animated.View>
        )   
    }
}


let s =  StyleSheet.create({
    itemAdd:{
        fontFamily : Fonts.regular.fontFamily,
        fontWeight : Fonts.regular.fontWeight,
        fontSize : Fonts.size.small,
        color : Colors.white
    },
    addContainer:{
        alignItems          : 'center',
        left                : 0,
        marginHorizontal    :Metrics.padding.small,
        paddingHorizontal : Metrics.padding.small,
        paddingVertical : Metrics.padding.tiny/2,
        borderWidth : 2,
        borderColor : Colors.tangerine,
        borderRadius :6,
        backgroundColor :Colors.tangerine
    },
    search_frame: {
        flex: 1,
        height              : TOOLBAR_HEIGHT/1.5,
        marginRight : Metrics.padding.small,
        borderRadius: 6,
        justifyContent: 'center',
        backgroundColor: "#f2f2f2"
    },
    oval: {
        width: Metrics.icon.small*.8,
        height: Metrics.icon.small*.8,
        marginLeft: Metrics.padding.tiny,
        borderRadius: (Metrics.icon.small*.8)/2,
        backgroundColor: '#fe8800',
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    ic_close: {
        width: Metrics.icon.tiny*.5,
        tintColor : 'white',
        height: Metrics.icon.tiny*.5
    },
    itemClose:{
        fontSize : Metrics.font.regular,
        color :'pink'
    },
    close:{
        alignItems          : 'center',
        left                : 0,
        marginHorizontal    :Metrics.padding.small,
        paddingHorizontal : Metrics.padding.small,
        paddingVertical : Metrics.padding.tiny,
        borderWidth : 2,
        borderColor : Colors.tangerine,
        borderRadius :3
    },
    input_search:{
        height              : TOOLBAR_HEIGHT/1.3,
        paddingHorizontal : Metrics.padding.small,
        //fontSize : Fonts.size.small,
    },
    searchBar:{
        flexDirection       : 'row',
        height              : TOOLBAR_HEIGHT,
        justifyContent      : 'center',
        alignItems          : 'center',
        paddingHorizontal    : Metrics.padding.small,
        paddingBottom : Metrics.padding.tiny,
    },
    toolbarView:{
        backgroundColor     : BACKGROUND_COLOR,
        paddingTop          : IS_IOS,
        height              : TOOLBAR_HEIGHT + IS_IOS,
    },
    contentToolbar:{
        flexDirection       : 'row',
        alignItems          : 'center',
        flex                : 1,
        //paddingHorizontal : Metrics.padding.small
    },
    IconToolbar:{
        height              : TOOLBAR_HEIGHT,
        maxWidth            : TOOLBAR_HEIGHT,
        minWidth            : TOOLBAR_HEIGHT - 10,
        justifyContent      : 'center',
        alignItems          : 'center',
    },
    Icon:{
        backgroundColor     : 'transparent',
        maxHeight           : ICON_SIZE,
        maxWidth            : ICON_SIZE,
        tintColor           : ICON_COLOR
    },
    context:{
        backgroundColor     : 'white',
        position            : 'absolute', 
        paddingVertical     : Metrics.padding.tiny,
        borderRadius        : 2,
        minWidth            : Metrics.screen.width / 2,
    },
    itemContext:{
        paddingVertical     : Metrics.padding.normal,  
        paddingHorizontal   : Metrics.padding.normal
    },
    contextLeft:{
        top                 : ICON_SIZE,
        left                : ICON_SIZE,    
    },
    contextRight:{
        top                 : ICON_SIZE - (ICON_SIZE * 0.5),
        right               : ICON_SIZE - (ICON_SIZE * 1.5),   
    },
    ViewTitle:{
        backgroundColor     : 'transparent',
        flex                : 1,
        justifyContent      : 'center',
    },
    titleStyle:{
        backgroundColor     : 'transparent',
        fontSize            : Fonts.size.medium,
        color               : TITLE_COLOR,
    },
    subtitleStyle:{
        backgroundColor     : 'transparent',
        fontSize            : 18,
        color               : SUBTITLE_COLOR,
        width : Metrics.screenWidth - 16
    },
    shadow:{
        shadowColor         : 'black',
        shadowOffset        : {width: 0,height: 0},
        shadowOpacity       : .1,
        shadowRadius        : 9,
        elevation           : 1,
    },
    hairline:{
        borderBottomWidth   : StyleSheet.hairlineWidth,
        borderBottomColor   : '#DDD'
    }
})