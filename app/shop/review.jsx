import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ReviewList from '../../components/shop/Review';

const Review = () => {
  const [reviewContent, setReviewContent] = useState('');
  return (
    <View className="flex-1">
      <TextInput
        label="Viết đánh giá của bạn"
        value={reviewContent}
        className="mt-12 mx-5 mb-5"
        onChangeText={(content) => setReviewContent(content)}
      />
      <ReviewList/>
    </View>
  );
};

export default Review;
