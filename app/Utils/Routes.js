import { NavigationActions } from 'react-navigation'

const navigateTo = (routeName, dispatch, navigation, params) => {
    let actionToDispatch = null
    if (params === null) {
        actionToDispatch = NavigationActions.reset({
            index   : 0,
            actions : [NavigationActions.navigate({ routeName })]
        })
    } else {
        actionToDispatch = NavigationActions.reset({
            index   : 0,
            actions : [NavigationActions.navigate({ routeName, params })]
        })
    }
    switch (true) {
        case undefined !== dispatch:
            dispatch(actionToDispatch)
            break
        default:
            navigation && navigation.dispatch(actionToDispatch)
            break
    }
}

export default navigateTo
