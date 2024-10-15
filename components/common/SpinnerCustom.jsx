import React from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector } from 'react-redux';
import { globalSelector } from '../../redux/slice/globalSlice';

const SpinnerCustom = () => {
  const { loading } = useSelector(globalSelector);
  return (
    <Spinner visible={loading.isLoading} textContent={loading.msg} textStyle={styles.spinnerTextStyle} />
  );
};

export default SpinnerCustom;
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
