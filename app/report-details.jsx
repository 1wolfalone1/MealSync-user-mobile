import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import api from "../api/api";
import ItemReportDetails from "../components/ItemReportDetails";

const ReportDetails = () => {
  const [reportDetails, setReportDetails] = useState(null);
  const params = useLocalSearchParams();

  const handleGetReportDetails = async () => {
    try {
      const res = await api.get(
        `/api/v1/customer/order/${params.orderId}/report`
      );
      const data = await res.data;
      console.log(data, " data reportDetails");
      setReportDetails(data.value);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    handleGetReportDetails();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-row justify-between px-4 py-4">
          <Text className="font-bold text-lg">Mã đơn hàng báo cáo</Text>
          <Text className="text-lg text-blue-900">#{params.orderId}</Text>
        </View>
        {reportDetails && reportDetails.reports &&
          Array.isArray(reportDetails.reports) &&
          reportDetails.reports.length > 0 &&
          reportDetails.reports[0].status != 1 && (
            <View className="px-4 py-2">

              <Text className="text-red-600 text-base mt-4">
                Quản trị viên {
                  reportDetails.reports[0].status == 3
                   ? "đã chấp nhận báo cáo"
                    : "đã từ chối báo cáo"
                }{reportDetails.reports[0] && " với lý do: " + reportDetails.reports[0].reason}
              </Text>
            </View>
          )}
        {reportDetails &&
          reportDetails.reports &&
          Array.isArray(reportDetails.reports) &&
          reportDetails.reports.map((i) => (
            <ItemReportDetails item={i} shopInfo={reportDetails.shopInfo} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportDetails;
