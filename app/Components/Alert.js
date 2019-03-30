import { 
    Alert as Alerts
 } from 'react-native'

function Alert(message) {
  return setTimeout(() => {
        Alerts.alert('',message)
    }, 100)
}

export default Alert
