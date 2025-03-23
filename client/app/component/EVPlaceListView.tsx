import { View, Text, FlatList } from "react-native";
import React from "react";

const EVPlaceListView = ({ placelist }: { placelist: any[] }) => {
  return (
    <View>
      <Text>EVPlaceListView</Text>
      <FlatList
        data={placelist}
        renderItem={({ item, index }) => <Text>{item.displayName.text}</Text>}
      />
    </View>
  );
};

export default EVPlaceListView;
