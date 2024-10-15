import React from 'react';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import globalSlice, { snackBarSelector } from '../../redux/slice/globalSlice';

const SnackBarCustom = () => {
  const { open, icon, iconFunction, action, style, duration, elevation, message } =
    useSelector(snackBarSelector);
  console.log(style, ' action');
  const dispatch = useDispatch();
  const onDismissSnackBar = () => {
    dispatch(globalSlice.actions.closeSnackBar());
  };
  return (
    <Snackbar
      visible={open}
      duration={duration}
      elevation={elevation}
      wrapperStyle={style.pos ? { ...style.pos } : {}}
      style={style}
      onDismiss={onDismissSnackBar}
      theme={{
        colors: { inverseOnSurface: style.color },
      }}
      action={{
        label: action.label,
        textColor: style.actionColor,
        icon: icon,
        onPress: action.onPress ? action.onPress : onDismissSnackBar,
      }}
    >
      {message}
    </Snackbar>
  );
};

export default SnackBarCustom;
