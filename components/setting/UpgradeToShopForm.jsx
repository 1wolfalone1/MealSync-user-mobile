import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput, Tooltip, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import globalSlice, { globalSelector } from '../../redux/slice/globalSlice';
const validationSchema = yup.object().shape({
  PhoneNumber: yup
    .string()
    .matches(/((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại'),
  ShopName: yup
    .string()
    .max(100, 'Tên cửa hàng không được vượt quá 100 ký tự')
    .required('Vui lòng nhập tên cửa hàng'),
  MinimumValueOrderFreeship: yup
    .number()
    .min(0, 'Giá trị tối thiểu đơn hàng miễn phí phải lớn hơn hoặc bằng 0')
    .max(1000000, 'Giá trị tối đa là 1,000,000')
    .required('Vui lòng nhập giá trị tối thiểu đơn hàng miễn phí'),
  Description: yup.string().max(200, 'Mô tả không được vượt quá 200 ký tự'),
  ShippingFee: yup
    .number()
    .min(0, 'Phí vận chuyển không được nhỏ hơn 0')
    .max(100000, 'Phí vận chuyển tối đa là 100,000'),
});

const UpgradeToShopForm = ({ formData, handleSubmit }) => {
  const dispatch = useDispatch();
  const [address, setAddress] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
  });

  const { map } = useSelector(globalSelector);
  const initialValues = {
    PhoneNumber: '',
    ActiveTo: 0,
    ActiveFrom: 0,
    ShopName: '',
    MinimumValueOrderFreeship: 0,
    Description: '',
    ShippingFee: 0,
  };
  const handleOpenMap = () => {
    router.push('/map');
  };
  console.log(address);
  useEffect(() => {
    console.log(map, ' map ne');
    if (map.isChange) {
      setAddress(map.origin);
    }
  }, [map]);
  useEffect(() => {
    return () => {
      dispatch(globalSlice.actions.resetMapsState());
    };
  }, []);
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenStatePicker] = useState(false);
  const [isFromDate, setIsFromDate] = useState(true);
  const [activeFrom, setActiveFrom] = useState('0:00')
  const [activeTo, setActiveTo] = useState('0:00');
  const onChange = (e, selectedDate) => {
    console.log('onChange', selectedDate);
    setDate(selectedDate);
    setOpenStatePicker(false);
  };
  return (
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form submitted with values:', values);
          // Handle your submit logic here, e.g., handleUpdateUserprofile(values);
          handleSubmit(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View className="gap-4 px-8 mt-8">
            <View>
              <TextInput
                onChangeText={handleChange('PhoneNumber')}
                onBlur={handleBlur('PhoneNumber')}
                value={values.PhoneNumber}
                mode="outlined"
                label="Số điện thoại"
              />
              <HelperText type="error" visible={touched.PhoneNumber && errors.PhoneNumber}>
                {errors.PhoneNumber}
              </HelperText>
            </View>
            <View>
              <TouchableRipple
                onPress={() => {
                  setOpenStatePicker(true);
                  setIsFromDate(true);
                }}
              >
                <TextInput
                  editable={false}
                  onChangeText={handleChange('ActiveFrom')}
                  onBlur={handleBlur('ActiveFrom')}
                  value={activeFrom}
                  mode="outlined"
                  label="Active From"
                  keyboardType="numeric"
                />
              </TouchableRipple>
              <HelperText type="error" visible={touched.ActiveFrom && errors.ActiveFrom}>
                {errors.ActiveFrom}
              </HelperText>
            </View>
            <View>
              {openDatePicker && (
                <DateTimePicker
                  value={date}
                  mode={'time'}
                  is24Hour={true}
                  onPointerCancel={() => {
                    setOpenStatePicker(false);
                  }}
                  onChange={(e, selectedDate) => {
                    console.log('onChange', selectedDate);
                    setDate(selectedDate);
                    setOpenStatePicker(false);
                    if (isFromDate) {
                      const hour = selectedDate.getHours();
                      const minutes = selectedDate.getMinutes();
                      setFieldValue('ActiveFrom', `${hour}${minutes}`);
                      setActiveFrom(`${hour}:${minutes}`);
                    } else {
                      const hour = selectedDate.getHours();
                      const minutes = selectedDate.getMinutes();
                      setFieldValue('ActiveTo', `${hour}${minutes}`);
                      setActiveTo(`${hour}:${minutes}`);
                    }
                  }}
                />
              )}
              <TouchableRipple
                onPress={() => {
                  setOpenStatePicker(true);
                  setIsFromDate(false);
                }}
              >
                <TextInput
                editable={false}
                  onChangeText={handleChange('ActiveTo')}
                  onBlur={handleBlur('ActiveTo')}
                  value={activeTo}
                  mode="outlined"
                  label="Active To"
                  keyboardType="numeric"
                />
              </TouchableRipple>
              <HelperText type="error" visible={touched.ActiveTo && errors.ActiveTo}>
                {errors.ActiveTo}
              </HelperText>
            </View>
            <View>
              <TextInput
                onChangeText={handleChange('ShopName')}
                onBlur={handleBlur('ShopName')}
                value={values.ShopName}
                mode="outlined"
                label="Tên cửa hàng"
              />
              <HelperText type="error" visible={touched.ShopName && errors.ShopName}>
                {errors.ShopName}
              </HelperText>
            </View>
            <View>
              <TextInput
                onChangeText={handleChange('MinimumValueOrderFreeship')}
                onBlur={handleBlur('MinimumValueOrderFreeship')}
                value={values.MinimumValueOrderFreeship.toString()}
                mode="outlined"
                label="Giá trị tối thiểu đơn hàng miễn phí"
                keyboardType="numeric"
              />
              <HelperText
                type="error"
                visible={touched.MinimumValueOrderFreeship && errors.MinimumValueOrderFreeship}
              >
                {errors.MinimumValueOrderFreeship}
              </HelperText>
            </View>
            <View>
              <TextInput
                onChangeText={handleChange('Description')}
                onBlur={handleBlur('Description')}
                value={values.Description}
                mode="outlined"
                label="Mô tả"
                multiline
                numberOfLines={3}
              />
              <HelperText type="error" visible={touched.Description && errors.Description}>
                {errors.Description}
              </HelperText>
            </View>
            <View>
              <TextInput
                onChangeText={handleChange('ShippingFee')}
                onBlur={handleBlur('ShippingFee')}
                value={values.ShippingFee.toString()}
                mode="outlined"
                label="Phí vận chuyển"
                keyboardType="numeric"
              />
              <HelperText type="error" visible={touched.ShippingFee && errors.ShippingFee}>
                {errors.ShippingFee}
              </HelperText>
            </View>
            <View>
              <Tooltip title={address?.name}>
                <View className="flex-row items-end justify-center gap-1">
                  <TextInput
                    value={address?.name}
                    onChangeText={handleChange('building')}
                    onBlur={handleBlur('building')}
                    mode="outlined"
                    label="Địa chỉ"
                    style={{
                      flex: 1,
                    }}
                    editable={false}
                    contentStyle={{
                      color: '#000000',
                    }}
                    className="flex-1 m-0"
                  />
                  <Button
                    icon="map-marker-plus"
                    onPress={handleOpenMap}
                    uppercase
                    className="rounded-xl p-1"
                    mode="elevated"
                    buttonColor={'blue'}
                    textColor="white"
                  >
                    change
                  </Button>
                </View>
              </Tooltip>
              <HelperText type="error" visible={touched.building && errors.building}>
                {errors.building}
              </HelperText>
            </View>
            <View className="justify-center items-center pb-10">
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ width: '80%', marginTop: 20 }}
              >
                Cập nhật
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default UpgradeToShopForm;
