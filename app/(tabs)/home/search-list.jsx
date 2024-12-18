import React, { useEffect } from "react";
import { FlatList, Image, SectionList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FilterBarinSearchList from "../../../components/user-page/FilterBarinSearchList";
import ItemBodyInSearchList from "../../../components/user-page/ItemBodyInSearchList";
import ItemHeaderInSearchList from "../../../components/user-page/ItemHeaderInSearchList";
import globalSlice from "../../../redux/slice/globalSlice";
import searchSlice, {
  getListSearchProductInHome,
  searchSliceSelector,
} from "../../../redux/slice/searchSlice";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
    zIndex: -1,
  },
});

const blankList = [
  {
    title: null,
    data: Array(5).fill(null),
  },
  {
    title: null,
    data: Array(5).fill(null),
  },
  {
    title: null,
    data: Array(5).fill(null),
  },
];
const SearchList = () => {
  const {
    searchProductInHome: { data, paging, filter, sort },
  } = useSelector(searchSliceSelector);
  const [dataSearchRender, setDataSearchRender] = React.useState(null);
  const dispatch = useDispatch();
  const handleGetDataSearch = async () => {
    try {
      const newData = handleDataSearch();
      setDataSearchRender(newData);
    } catch (e) {
      console.error(e);
    }
  };
  const handleDataSearch = () => {
    const newData = data.map((item) => {
      return {
        title: {
          id: item.id,
          shopName: item.name,
          title: item.description,
          address: item.averageRating,
          price: item.totalOrder,
          banner: item.bannerUrl,
          avatar: item.logoUrl,
        },
        data: item.foods,
      };
    });
    return newData;
  };
  useEffect(() => {
    console.log("is search data chagen");

    dispatch(getListSearchProductInHome());
  }, [paging, sort, filter]);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      handleGetDataSearch();
    }
  }, [data]);
  useEffect(() => {
    dispatch(globalSlice.actions.changeSearchPage());
    return () => {
      dispatch(globalSlice.actions.resetSearchPage());
      dispatch(searchSlice.actions.resetSearchProductInProduct());
    };
  }, []);
  return (
    <View className="mt-3 mb-1000">
      <FilterBarinSearchList />
      {dataSearchRender && dataSearchRender.length > 0 ? (
        <SectionList
          CellRendererComponent={({ children, index, style, ...props }) => {
            const cellStyle = [
              style,
              {
                zIndex: -1,
                elevation: -1,
              },
            ];

            return (
              <View style={cellStyle} index={index} {...props}>
                {children}
              </View>
            );
          }}
          ListHeaderComponentStyle={{ zIndex: 10 }}
          className="flex-1"
          contentContainerStyle={{ zIndex: 1 }}
          keyExtractor={(item, index) => index}
          sections={dataSearchRender ? dataSearchRender : blankList}
          scrollEnabled={false}
          SectionSeparatorComponent={(section, index) => {
            return (
              <View
                style={{
                  height: 4,
                  borderRadius: 231,
                  backgroundColor: "#9e9a9a59",
                }}
              />
            );
          }}
          renderSectionHeader={({ section: { title, data } }) => (
            <View className=" my-4 ">
              <ItemHeaderInSearchList item={title} />

              <FlatList
                className="px-7 w-full"
                contentContainerStyle={{ paddingRight: 56 }}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: 10,
                      height: 1,
                    }}
                  />
                )}
                renderItem={({ item }) => (
                  <ItemBodyInSearchList item={item} shopId={title?.id} />
                )}
              />
            </View>
          )}
          renderItem={({ item }) => null}
        />
      ) : (
        <View
          className="items-center justify-center mt-8"
          style={{
            height: 400,
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: "https://mealsync.s3.ap-southeast-1.amazonaws.com/image/1733499673958-cca03ac5-281b-46b3-ae0c-46afe5cff5bb.png",
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SearchList;

const data = [
  {
    title: {
      shopName: "Bún bò huế Phú Lộc",
      star: 3.5,
      title: "Bún - PHở - cơm",
      banner:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4fVcExYeQOa4L3AahyuyAh4rlLfaKuHd6EWJZAlcKSUYVJS7IcugGE1impKxwfJDTvU&usqp=CAU",
      avatar:
        "https://ih1.redbubble.net/image.2997619924.6331/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      address: "Tòa S1001",
      price: "12k -> 30k",
    },
    data: [
      {
        id: 1,
        name: "Bún bò bắp",
        image:
          "https://file.hstatic.net/200000395159/article/nau-bun-bo-hue-chuan-vi-tai-nha-voi-cot-co-dac-quoc-viet-foods_59b7ba1543004e67967af718d8afc32b.jpg",
        price: "30k",
      },
      {
        id: 2,
        name: "Bún bò tái",
        price: "30k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 3,
        name: "Bún bò sườn",
        price: "40k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 4,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
      {
        id: 6,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
      {
        id: 5,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
    ],
  },
  {
    title: {
      shopName: "Bún bò huế Phú Lộc",
      star: 3.5,
      title: "Bún - PHở - cơm",
      banner:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4fVcExYeQOa4L3AahyuyAh4rlLfaKuHd6EWJZAlcKSUYVJS7IcugGE1impKxwfJDTvU&usqp=CAU",
      avatar:
        "https://ih1.redbubble.net/image.2997619924.6331/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      address: "Tòa S1001",
      price: "12k -> 30k",
    },
    data: [
      {
        id: 1,
        name: "Bún bò bắp",
        image:
          "https://file.hstatic.net/200000395159/article/nau-bun-bo-hue-chuan-vi-tai-nha-voi-cot-co-dac-quoc-viet-foods_59b7ba1543004e67967af718d8afc32b.jpg",
        price: "30k",
      },
      {
        id: 2,
        name: "Bún bò tái",
        price: "30k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 3,
        name: "Bún bò sườn",
        price: "40k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 4,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
    ],
  },
  {
    title: {
      shopName: "Bún bò huế Phú Lộc",
      star: 3.5,
      title: "Bún - PHở - cơm",
      banner:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4fVcExYeQOa4L3AahyuyAh4rlLfaKuHd6EWJZAlcKSUYVJS7IcugGE1impKxwfJDTvU&usqp=CAU",
      avatar:
        "https://ih1.redbubble.net/image.2997619924.6331/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      address: "Tòa S1001",
      price: "12k -> 30k",
    },
    data: [
      {
        id: 1,
        name: "Bún bò bắp",
        image:
          "https://file.hstatic.net/200000395159/article/nau-bun-bo-hue-chuan-vi-tai-nha-voi-cot-co-dac-quoc-viet-foods_59b7ba1543004e67967af718d8afc32b.jpg",
        price: "30k",
      },
      {
        id: 2,
        name: "Bún bò tái",
        price: "30k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 3,
        name: "Bún bò sườn",
        price: "40k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 4,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
    ],
  },
  {
    title: {
      shopName: "Bún bò huế Phú Lộc",
      star: 3.5,
      title: "Bún - PHở - cơm",
      banner:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4fVcExYeQOa4L3AahyuyAh4rlLfaKuHd6EWJZAlcKSUYVJS7IcugGE1impKxwfJDTvU&usqp=CAU",
      avatar:
        "https://ih1.redbubble.net/image.2997619924.6331/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      address: "Tòa S1001",
      price: "12k -> 30k",
    },
    data: [
      {
        id: 1,
        name: "Bún bò bắp",
        image:
          "https://file.hstatic.net/200000395159/article/nau-bun-bo-hue-chuan-vi-tai-nha-voi-cot-co-dac-quoc-viet-foods_59b7ba1543004e67967af718d8afc32b.jpg",
        price: "30k",
      },
      {
        id: 2,
        name: "Bún bò tái",
        price: "30k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 3,
        name: "Bún bò sườn",
        price: "40k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 4,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
    ],
  },
  {
    title: {
      shopName: "Bún bò huế Phú Lộc",
      star: 3.5,
      title: "Bún - PHở - cơm",
      banner:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd4fVcExYeQOa4L3AahyuyAh4rlLfaKuHd6EWJZAlcKSUYVJS7IcugGE1impKxwfJDTvU&usqp=CAU",
      avatar:
        "https://ih1.redbubble.net/image.2997619924.6331/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg",
      address: "Tòa S1001",
      price: "12k -> 30k",
    },
    data: [
      {
        id: 1,
        name: "Bún bò bắp",
        image:
          "https://file.hstatic.net/200000395159/article/nau-bun-bo-hue-chuan-vi-tai-nha-voi-cot-co-dac-quoc-viet-foods_59b7ba1543004e67967af718d8afc32b.jpg",
        price: "30k",
      },
      {
        id: 2,
        name: "Bún bò tái",
        price: "30k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 3,
        name: "Bún bò sườn",
        price: "40k",
        image: "https://nethue.com.vn/uploaded/tin-tuc-biquyet-1.jpg",
      },
      {
        id: 4,
        name: "Bún bò giò",
        price: "50k",
        image:
          "https://www.cooking-therapy.com/wp-content/uploads/2023/10/Bun-Bo-Hue-Recipe-13.jpg",
      },
    ],
  },
];
