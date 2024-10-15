
import { createStackNavigator } from '@react-navigation/stack'
import { withLayoutContext } from 'expo-router'

const { Navigator } = createStackNavigator()

// This can be used like `<JsStack />`
export const JsStack = withLayoutContext(Navigator)