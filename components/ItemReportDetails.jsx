import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { Card, Surface, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { userInfoSliceSelector } from "../redux/slice/userSlice";
import { formatDateTime } from "../utils/MyUtils";

const { width } = Dimensions.get("window");

const ItemReportDetails = ({ item, shopInfo }) => {
  const info = useSelector(userInfoSliceSelector);
  const { width, height } = Dimensions.get("window");
  const widthImage2 = (width * 22) / 100;
  const getStatusColor = (status) => {
    switch (status) {
      case 2:
        return "#aa6f02"; // Orange for status 2
      case 3:
        return "#ad0000"; // Green for status 3
      default:
        return "#757575"; // Grey for default
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đang chờ";
      case 2:
        return "Được Đồng ý";
      default:
        return "Bị từ chối";
    }
  };

  const renderImages = () => {
    if (!item.imageUrls || item.imageUrls.length === 0) return null;

    return (
      <>
        <Text className="text-gray-600">Hình ảnh đính kèm:</Text>
        <View className="flex-row flex-wrap bg-transparent justify-between">
          <FlatList
            contentContainerStyle={{}}
            data={item.imageUrls}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({ item, index }) => {
              return (
                <Surface
                  elevation={2}
                  style={{
                    overflow: "hidden",
                    width: widthImage2,
                    height: widthImage2,
                    margin: 10,
                    borderRadius: 24,
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                </Surface>
              );
            }}
          />
        </View>
      </>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          {item.isReportedByCustomer ? (
            <Text variant="titleLarge" style={styles.title}>
              {item.title}
            </Text>
          ) : (
            <>
              <View>
                <Text variant="titleLarge" style={styles.title}>
                  Trả lời từ cửa hàng
                </Text>
              </View>
            </>
          )}
          <Text
            style={[
              {
                color: getStatusColor(item.status),
              },
              styles.statusChip,
            ]}
          >
             {item.isReportedByCustomer  && getStatusText(item.status)}
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.content}>
          Lý do: <Text className="text-gray-600">{item.content}</Text>
        </Text>

        {renderImages()}

        <View style={styles.footer} className="justify-between">
          <Text variant="bodySmall" style={styles.timestamp}>
            {formatDateTime(item.createdDate)}
          </Text>
          <View className="flex-1 flex-row justify-end ml-20">
            <Text
              variant="bodySmall"
              className="flex-wrap text-ellipsis"
              style={styles.reporter}
              numberOfLines={2}
            >
              Báo cáo từ:{" "}
              {item.isReportedByCustomer
                ? info.fullName + ` (Bạn)`
                : "Cửa hàng " + shopInfo.name}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    width: width - 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontWeight: "500",
  },
  statusChip: {
    marginLeft: 8,
  },
  content: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  reasonContainer: {
    marginBottom: 12,
  },
  reasonLabel: {
    color: "#757575",
    marginBottom: 4,
  },
  reason: {
    fontStyle: "italic",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  image: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    color: "#757575",
  },
  reporter: {
    color: "#757575",
  },
});

export default ItemReportDetails;
