import { Platform } from 'react-native'

export function _OS(ios, android) {
  return (Platform.OS === 'ios') ? ios : android;
}