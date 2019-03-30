import React, { Component } from 'react'
import { View,
     Image,
    StyleSheet,
    Switch,
    Animated
     } from 'react-native'

import PropTypes from 'prop-types'
import s from '../Styles'
import { Metrics, Colors, getIcon, Scale, Touchable, TextView as Text , Fonts} from '../index'
    


export default class CheckListButton extends Component {
  constructor() {
    super()
    this.state = {
        active : false,
        opacity: new Animated.Value(0)
    }
    }

    press = () => {
        this.props.onSelect(this.props.value)
    }

    componentWillMount() {
        this.setActive(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.setActive(newProps);
    }

    setActive(props) {
        let value    = props.value    || ' ',
            selected = props.selected || ' '

            this.setState({ active: value=== selected},
                () => {
                   Animated.spring(this.state.opacity, { toValue: this.state.active ? 2 : 0,friction: 2}).start()
               }
      );
    }

    render() {
        let active    = this.state.opacity.interpolate({inputRange  : [0, .5, 2],outputRange : [0, 2, 1]}),
            opacity   = this.state.opacity.interpolate({inputRange  : [0, .5, 2],outputRange : [0, 0, 1]}),
            { props } = this   
        
        return ( 
            <Touchable onPress={()=> this.press()}>
              <View style={s.cardcheck}>
                <View style={s.main}>
                    <View style={s.labelCheck}>
                        {!!props.label    && <Text style={s.textCheck}>{props.label}</Text>}
                        {/* {!!props.subtext  && <Text style={s.subtext}>{props.subtext}</Text>} */}
                    </View>
                </View>
                {this.state.active  &&
                    <View style={s.container_check}>
                        <Image
                            source= {getIcon('ic_checked')}
                            style ={s.checklist}
                        />
                    </View>
                }

              </View>

            </Touchable>
        )
    }
    }

// const s = StyleSheet.create({

// })
