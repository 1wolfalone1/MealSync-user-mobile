import { ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import { Colors } from '../../constant';
import images from '../../constant/images';
import { formatNumberVND, parseDateStringToOnlyDate } from '../../utils/MyUtils';
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 4, height: 4 },
    shadowColor: Colors.shadow[400],

    shadowOpacity: 0.1,
    elevation: 10,
    // background color must be set
  },
  shadowSelected: {
    shadowOffset: { width: 8, height: 8 },
    shadowColor: Colors.shadow.DEFAULT,

    shadowOpacity: 0.1,

    elevation: 4,
    // background color must be set
  },
});
const InactiveVoucher = ({ item }) => {
  const [image, setImage] = useState('');
  const { width, height } = Dimensions.get('window');
  const widthImage = parseInt((width * 25) / 100);
  const [open, setOpen] = useState(false);
  const handleCloseConditionText = () => {
    setOpen(false);
  };
  const genPromotionTitle = (item) => {
    if (item.applyType == 1) {
      return `Giảm ${item.amountRate}% \nTối đa ${formatNumberVND(item.maximumApplyValue)}`;
    } else {
      return `Giảm ${formatNumberVND(item.amountValue)}  Áp dụng đơn hàng từ ${formatNumberVND(item.minimumOrderValue)}`;
    }
  };
  return (
    <>
      <Portal>
        <Dialog visible={open} onDismiss={handleCloseConditionText}>
          <Dialog.Title
            style={{
              color: Colors.primaryBackgroundColor,
            }}
          >
            Điều kiện của voucher :_)
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{genPromotionTitle(item)}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseConditionText}>Đóng</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View
        className="flex-row mb-4 justify-between"
        style={{
          height: widthImage,
          width: '100%',
          backgroundColor: 'white',
          ...styles.shadow,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <Image
          source={images.PromotionShopLogo}
          style={{
            height: widthImage,
            width: widthImage,

            opacity: 0.7,
          }}
        />
        <View
          className="ml-2 flex-1 justify-between p-2"
          style={{
            opacity: 0.7,
          }}
        >
          <Text numberOfLines={5} className="font-hnow63book flex-1">
            {item.title}
          </Text>
          <Text className="text-xs mb-1 text-gray-500">Giới hạn: {item.usageLimit} mã</Text>
          <View className="flex-row gap-2 flex-wrap h-[30]">
            <Text numberOfLines={1} className="text-primary">
              {parseDateStringToOnlyDate(item.startDate)}
            </Text>
            <ArrowRight color={'red'} size={20} />
            <Text numberOfLines={1} className="text-blue-500">
              {parseDateStringToOnlyDate(item.endDate)}
            </Text>
          </View>
        </View>
        <View
          className="justify-end"
          style={{
            opacity: 1,
            zIndex: 100,
          }}
        >
          <Button onPress={() => setOpen(true)}>Điều kiện</Button>
        </View>
      </View>
    </>
  );
};

export default InactiveVoucher;
