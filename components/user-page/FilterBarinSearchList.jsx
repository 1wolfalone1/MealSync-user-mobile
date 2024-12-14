import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch } from "react-redux";
import { Colors } from "../../constant";
import searchSlice from "../../redux/slice/searchSlice";
const FilterBarinSearchList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [listFrom, setListFrom] = useState([]);
  const [listTo, setListTo] = useState([]);
  const [value, setValue] = useState(1);
  const [items, setItems] = useState([
    { label: "Bỏ trống", value: 0 },
    { label: "Giá", value: 1 },
    { label: "Sao", value: 2 },
  ]);
  const generateTimeList = (startValue = 0) => {
    const times = [];
    for (let value = startValue; value <= 2330; value += 30) {
      if (value % 100 == 60) {
        value = value - 60 + 100; // Move to next hour if current value is 60:00
      }
      const hours = Math.floor(value / 100);
      const minutes = value % 100 === 0 ? "00" : "30";
      const label = `${hours}:${minutes}`;
      times.push({ label, value });
    }
    return times;
  };

  // Initialize listFrom on component mount
  useEffect(() => {
    setListFrom(generateTimeList(0)); // Full list from 0:00 to 24:00
  }, []);

  // Update listTo when selectedFrom changes
  useEffect(() => {
    if (selectedFrom == 2330) {
      setListTo({
        label: "24:00",
        value: 2400,
      });
      setSelectedTo(null);

      return;
    }
    setSelectedTo(null);
    setListTo(generateTimeList(selectedFrom + 30));
  }, [selectedFrom]);
  const [openSort, setOpenSort] = useState(false);
  const [valueSort, setValueSort] = useState(1);
  const [itemsSort, setItemsSort] = useState([
    { label: "Tăng dần", value: 1 },
    { label: "Giảm dần", value: 2 },
  ]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    dispatch(
      searchSlice.actions.updateFilterInSearchProductInHome({
        start: selectedFrom ? selectedFrom : 0,
        end: selectedTo ? selectedTo : 2400,
      })
    );
  }, [selectedFrom, selectedTo]);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        style={{
          paddingLeft: 28,
          zIndex: 1000,
          elevation: 1000,
          flexDirection: "row",
          alignItems: "center",
        }}
        className="justify-start"
      >
        <View>
          <DropDownPicker
            listMode="MODAL"
            zIndex={3000}
            modalAnimationType="fade"
            mode="SIMPLE"
            zIndexInverse={1000}
            open={open}
            style={{
              borderColor: Colors.primaryBackgroundColor,
              width: 120,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            containerStyle={{}}
            className="w-[160] border-primary"
            categorySelectable={true}
            dropDownContainerStyle={{
              backgroundColor: "white",
              zIndex: 1001,
              elevation: 1001,
              width: 120,
              paddingHorizontal: 1,
              borderColor: Colors.primaryBackgroundColor,
            }}
            value={value}
            items={items}
            setOpen={setOpen}
            onChangeValue={(value) => {
              dispatch(
                searchSlice.actions.updateSortInSearchProductInHome({
                  orderType: value,
                })
              );
            }}
            setValue={setValue}
            setItems={setItems}
            placeholder={"Sắp xếp theo"}
          />
        </View>
        <View>
          <DropDownPicker
            listMode="MODAL"
            modalAnimationType="fade"
            mode="SIMPLE"
            zIndex={2000}
            zIndexInverse={2000}
            open={openSort}
            style={{
              borderColor: Colors.primaryBackgroundColor,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            className="w-[100] border-primary"
            categorySelectable={true}
            placeholderStyle={{ color: "grey" }}
            dropDownContainerStyle={{
              backgroundColor: "white",
              zIndex: 1000,
              elevation: 1000,
              width: 100,
              borderColor: Colors.primaryBackgroundColor,
            }}
            value={valueSort}
            items={itemsSort}
            setOpen={setOpenSort}
            onChangeValue={(value) => {
              dispatch(
                searchSlice.actions.updateSortInSearchProductInHome({
                  orderMode: value,
                })
              );
            }}
            setValue={setValueSort}
            setItems={setItemsSort}
            placeholder={""}
          />
        </View>
        <View className="flex-row justify-start flex-1 ml-2">
          <View>
            <DropDownPicker
              listMode="MODAL"
              modalAnimationType="fade"
              mode="SIMPLE"
              open={openFrom}
              autoScroll={false}
              scrollViewProps={{
                focusable: true,
                bounces: 5,
                scrollEnabled: true,
              }}
              style={{
                borderColor: Colors.primaryBackgroundColor,
                width: 100,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              zIndex={3000}
              zIndexInverse={1000}
              categorySelectable={true}
              placeholderStyle={{ color: "grey" }}
              dropDownContainerStyle={{
                backgroundColor: "white",

                borderColor: Colors.primaryBackgroundColor,
                width: 100,
              }}
              textStyle={{}}
              value={selectedFrom}
              items={listFrom}
              setOpen={setOpenFrom}
              onChangeValue={(value) => {
                console.log(value);
                setSelectedFrom(value);
              }}
              setValue={setSelectedFrom}
              setItems={setListFrom}
              placeholder={"Từ"}
            />
          </View>
          <View>
            <DropDownPicker
              listMode="MODAL"
              modalAnimationType="fade"
              mode="SIMPLE"
              open={openTo}
              style={{
                borderColor: Colors.primaryBackgroundColor,
                width: 100,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              scrollViewProps={{
                focusable: true,
                bounces: 5,
                scrollEnabled: true,
              }}
              zIndex={2000}
              zIndexInverse={2000}
              categorySelectable={true}
              placeholderStyle={{ color: "grey" }}
              dropDownContainerStyle={{
                backgroundColor: "white",

                borderColor: Colors.primaryBackgroundColor,
                width: 100,
              }}
              textStyle={{}}
              value={selectedTo}
              items={listTo}
              setOpen={setOpenTo}
              onChangeValue={(value) => {
                setSelectedTo(value);
              }}
              setValue={setSelectedTo}
              setItems={setListTo}
              placeholder={"đến"}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default FilterBarinSearchList;
