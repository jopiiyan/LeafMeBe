import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "react-native-paper";

type ArticleData = {
  propTitle: string;
  propSubTitle: string;

  content_1: string;
  content_2: string;
  content_3: string;
  content_4: string;

  contentTitle: string;

  contentHeader_1: string;
  contentHeader_2: string;
  contentHeader_3: string;

  propImage: ImageSourcePropType;
};

export default function Article({ article }: { article: ArticleData }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* ----- CARD PREVIEW ----- */}
      <View style={{ marginBottom: 10 }}>
        <Pressable onPress={() => setShowModal(true)}>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#1c1c1c",
            }}
          >
            <Image
              source={article.propImage}
              style={{
                width: "100%",
                height: 240,
                objectFit: "cover",
              }}
            />

            <View style={{ padding: 12, gap: 2 }}>
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "700",
                  color: "#e6e6e6",
                }}
              >
                {article.propTitle}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  color: "#bdbdbd",
                }}
              >
                {article.propSubTitle}.
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* ----- FULL ARTICLE MODAL ----- */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          {/* ---- FIXED HEADER ---- */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 70,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderBottomWidth: 0.3,
              borderBottomColor: "#333",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              {article.contentTitle}
            </Text>

            <Ionicons
              name="close-circle"
              size={40}
              color="white"
              onPress={() => setShowModal(false)}
              style={{ position: "absolute", right: 15 }}
            />
          </View>

          {/* ---- SCROLLABLE CONTENT ---- */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: 80, // space for sticky header
              paddingBottom: 40,
            }}
          >
            {/* Big Image */}
            <Image
              source={article.propImage}
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
              }}
            />

            {/* Article Text */}
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "900",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                {article.propTitle}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#e0e0e0",
                  lineHeight: 22,
                  marginBottom: 22,
                }}
              >
                {article.content_1}
              </Text>

              {/* Header 1 */}
              <Text
                style={{ fontSize: 20, color: "#ffffffff", fontWeight: "900" }}
              >
                {article.contentHeader_1}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#e0e0e0",
                  lineHeight: 22,
                  marginBottom: 22,
                }}
              >
                {article.content_2}
              </Text>

              {/* Header 2 */}
              <Text
                style={{ fontSize: 20, color: "#ffffffff", fontWeight: "900" }}
              >
                {article.contentHeader_2}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#e0e0e0",
                  lineHeight: 22,
                  marginBottom: 22,
                }}
              >
                {article.content_3}
              </Text>

              {/* Header 3 */}
              <Text
                style={{ fontSize: 20, color: "#ffffffff", fontWeight: "900" }}
              >
                {article.contentHeader_3}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#e0e0e0",
                  lineHeight: 22,
                  marginBottom: 22,
                }}
              >
                {article.content_4}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
