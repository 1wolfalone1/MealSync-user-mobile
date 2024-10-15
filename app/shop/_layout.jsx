import { TransitionPresets } from "@react-navigation/stack";
import { JsStack } from "../../components/custom-stack/JsStack";

const ShopLayout = () => {
  return (
    <>
      <JsStack
        screenOptions={{
          tabBarStyle: {
            height: "0",
          },
        }}
      >
        <JsStack.Screen
          name="index"
          options={{
            title: "index",
            presentation: "",
            headerShown: false,
          }}
        />
        <JsStack.Screen
          name="[productId]"
          options={{
            title: "product-detail",
            headerShown: false,
            mode: "model",
            gestureEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
          }}
        />
        <JsStack.Screen
          name="temp-cart"
          options={{
            title: "product-detail",
            headerShown: false,
            mode: "model",
            gestureEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
          }}
        />
        <JsStack.Screen
          name="order2"
          options={{
            title: "product-detail",
            headerShown: false,
          }}
        />
          <JsStack.Screen
          name="change-info"
          options={{
            title: "product-detail",
            headerShown: false,
            mode: "model",
            gestureEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
          }}
        />
        
      </JsStack>
    </>
  );
};

export default ShopLayout;
