import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Checkbox, Divider, RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Images } from "../../constant";
import colors from "../../constant/colors";
import shopDetailsSlice from "../../redux/slice/shopDetailsSlice";
import { formatNumberVND } from "../../utils/MyUtils";
const ToppingItem = ({ topping }) => {
  const dispatch = useDispatch();

  return topping == null ? (
    <SkeletonItem />
  ) : (
    <View>
      {topping.optionGroup.type == 1 ? (
        <ToppingRadio topping={topping.optionGroup} />
      ) : (
        <ToppingCheckBox topping={topping.optionGroup} />
      )}
    </View>
  );
};

export default ToppingItem;

const SkeletonItem = ({}) => {
  return (
    <View>
      <Text>SkeletonItem</Text>
    </View>
  );
};

const ToppingRadio = ({ topping }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const handleSetValue = (v) => {
    if (v === value) {
      setValue(-1);
    } else {
      setValue(v);
    }
  };

  useEffect(() => {
    if (value != null) {
      dispatch(
        shopDetailsSlice.actions.addToppingRadio({
          toppingId: topping.id,
          optionId: value,
        })
      );
    }
  }, [value]);
  return (
    <RadioButton.Group
      onValueChange={(value) => handleSetValue(value)}
      value={value}
    >
      <Divider />
      <Text className="text-lg font-bold my-1">
        {topping.title}
        <Text className="text-sm text-gray-600 font-hnow63book">
          {" "}
         {topping.isRequire ? "(chọn 1)" : "(tùy chọn)"} 
        </Text>{" "}
      </Text>
      <Divider />
      <View className="gap-4 mt-0 mb-4">
        {topping.options.map((item, index) => (
          <View
            className="flex flex-row justify-between items-center"
            key={item.id}
          >
            <View className="flex flex-row items-center">
              <Image
                source={
                  item.imageUrl ? { uri: item.imageUrl } : Images.ToppingDefault
                }
                className="w-8 h-8 rounded-lg"
              />

              <Text className="ml-2">{item.title}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-primary">
                {formatNumberVND(item.price)}
              </Text>
              <RadioButton.Android
                value={item.id}
                // status={toppingChecked === item.name ? 'checked' : 'unchecked'}
                color={colors.primaryBackgroundColor}
              />
            </View>
          </View>
        ))}
      </View>
    </RadioButton.Group>
  );
};

const ToppingCheckBox = ({ topping }) => {
  const dispatch = useDispatch();

  const [checks, setChecked] = useState(null);
  const getStatus = (id) => {
    return checks?.includes(id);
  };
  const setStatus = (id) => {
    if (checks == null) {
      setChecked([id]);
    } else {
      if (checks.includes(id)) {
        setChecked(checks.filter((item) => item !== id));
      } else {
        setChecked([...checks, id]);
      }
    }
  };
  useEffect(() => {
    if (checks != null) {
      dispatch(
        shopDetailsSlice.actions.addToppingCheckbox({
          toppingId: topping.id,
          checks: checks,
        })
      );
    }
  }, [checks]);
  return (
    <View>
      <Divider />
      <Text className="text-lg font-bold my-1">
        {topping.title}
        <Text className="text-sm text-gray-600 font-hnow63book">
          {`(Chọn tối thiểu ${topping.minChoices}, tối đa ${topping.maxChoices})`}
        </Text>
      </Text>
      <Divider />
      <View className="gap-4 mt-0 mb-4">
        {topping.options.map((item, index) => (
          <View
            className="flex flex-row justify-between items-center"
            key={item.id}
          >
            <View className="flex flex-row items-center">
              <Image
                source={
                  item.imageUrl ? { uri: item.imageUrl } : Images.ToppingDefault
                }
                className="w-8 h-8 rounded-lg mr-2"
              />
              <Text className="ml-2 font-hnow64regular">{item.title}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-primary">
                {formatNumberVND(item.price)}
              </Text>
              <Checkbox.Android
                value={item.id}
                status={getStatus(item.id) ? "checked" : "unchecked"}
                color={colors.primaryBackgroundColor}
                onPress={(e) => setStatus(item.id)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
