import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopBar = withLayoutContext(Navigator);
export default MaterialTopBar;
