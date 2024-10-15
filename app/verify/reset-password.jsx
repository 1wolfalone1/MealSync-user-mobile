import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import api from '../../api/api';
import HeaderInForgot from '../../components/common/HeaderInForgot';
import { Colors } from '../../constant';
import persistSlice, { persistSliceSelector } from '../../redux/slice/persistSlice';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(25, 'Mật khẩu chỉ có tối đa 25 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một ký tự số (0-9)')
    .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in thường (a-z)')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in hoa (A-Z)')
    .matches(
      /[^\w]/,
      'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (`, ~, !, @, #, $, %, ^, &, *, ?)',
    )
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
});

export default function ResetPassword() {
  const [isShowPassword, setIsShownPassword] = useState(false);
  const [isShowConfirmPassword, setIsShownConfirmPassword] = useState(false);
  const { code, emailTemp } = useSelector(persistSliceSelector);
  const [message, setMessage] = useState();
  const dispatch = useDispatch();

  const handleResetPassword = async (values) => {
    const payload = {
      code,
      email: emailTemp,
      newPassword: values.password,
    };

    try {
      const responseData = await api.post('/api/v1/customer/forgot-password', payload);
      const data = await responseData.data;
      handleResetPasswordResponseData(
        data.isSuccess,
        data.error.code,
        data.error.message,
      );
    } catch (error) {
      console.log('error ne', error);
    }
  };

  const handleResetPasswordResponseData = async (isSuccess, errorCode, errorMessage) => {
    if (isSuccess) {
      dispatch(persistSlice.actions.saveIsReset(true));
      router.push('sign-in');
    } else if (errorCode === '400') {
      setMessage(errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <HeaderInForgot
        back="verify/verify-code"
        title="Đặt mật khẩu mới"
        des="Nhập mật khẩu mới mà bạn muốn đặt"
      />

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        onSubmit={(values) => {
          handleResetPassword(values);
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className="flex items-center">
            <View className="w-full items-center">
              <TextInput
                style={{ backgroundColor: 'transparent', width: '80%' }}
                type="flat"
                onBlur={handleBlur('password')}
                dense
                value={values.password}
                onChangeText={handleChange('password')}
                secureTextEntry={!isShowPassword}
                right={
                  !isShowPassword ? (
                    <TextInput.Icon icon="eye-off" onPress={() => setIsShownPassword(true)} />
                  ) : (
                    <TextInput.Icon icon="eye" onPress={() => setIsShownPassword(false)} />
                  )
                }
                placeholder="Nhập mật khẩu mới"
              />
              <View className="w-[80%]">
                <HelperText type="error" visible={touched.password && errors.password}>
                  {errors.password}{' '}
                </HelperText>
              </View>
            </View>
            <View className="w-full items-center">
              <TextInput
                style={{ backgroundColor: 'transparent', width: '80%' }}
                type="flat"
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                secureTextEntry={!isShowConfirmPassword}
                right={
                  !isShowConfirmPassword ? (
                    <TextInput.Icon
                      icon="eye-off"
                      onPress={() => setIsShownConfirmPassword(true)}
                    />
                  ) : (
                    <TextInput.Icon icon="eye" onPress={() => setIsShownConfirmPassword(false)} />
                  )
                }
                placeholder="Nhập lại mật khẩu"
              />
              <View className="w-[80%]">
                <HelperText
                  type="error"
                  visible={touched.confirmPassword && errors.confirmPassword}
                >
                  {errors.confirmPassword}{' '}
                </HelperText>
              </View>
            </View>
            <View className="w-[80%] mt-4">
              {message && (
                <HelperText type="error" className="text-center text-base">
                  {message}
                </HelperText>
              )}
            </View>
            <Button
              buttonColor={Colors.primaryBackgroundColor}
              textColor={Colors.commonBtnText}
              mode="elevated"
              style={{ width: '80%' }}
              theme={{ roundness: 2 }}
              contentStyle={{
                paddingVertical: 4,
              }}
              labelStyle={{
                fontFamily: 'HeadingNow-64Regular',
                fontSize: 16,
                fontWeight: 700,
              }}
              onPress={handleSubmit}
            >
              Đặt lại mật khẩu
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
