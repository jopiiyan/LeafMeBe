import { useAuth } from "@/lib/auth-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Button, SegmentedButtons, Text } from "react-native-paper";
import { articlesData } from "../Articles/Articlecontent";
import Article from "../components/Article";
import SummaryChart from "../components/SummaryChart";
import TotalWater from "../components/totalWater";

const plant = require("../../assets/images/plants.png");

export default function HomeScreen() {
  const water_dispensed = ["50", "100", "150"];
  const [Water, setWater] = useState("");
  const [Success, setSuccess] = useState(false);
  const [totalWater, settotalWater] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const { signOut } = useAuth();
  const [dailyWatering, setDailyWatering] = useState(false);

  const water_data = { water: Water };

  useEffect(() => {
    axios
      .get("https://leafmebe-1.onrender.com/api/water/sum")
      .then((res) => {
        settotalWater(res.data);
      })
      .catch((err) => console.log(err));
  }, [Success]);

  useEffect(() => {
    axios
      .get("https://leafmebe-1.onrender.com/api/water/device-state")
      .then((res) => {
        const data = res.data;
        console.log("Loaded device state:", data);

        // restore segmented button
        setWater(data.target_ml?.toString() ?? "");

        // restore daily watering switch
        setDailyWatering(data.daily_watering === 1);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = () => {
    axios
      .put(
        "https://leafmebe-1.onrender.com/api/water/device-state/start",
        water_data
      )
      .then(() => {
        setSuccess(true);
        setWater("");
      })
      .catch((err) => console.log(err));
  };

  const updateDailyWatering = (value) => {
    const payload = { daily_watering: value ? 1 : 0 };

    axios
      .put(
        "https://leafmebe-1.onrender.com/api/water/device-state/daily",
        payload
      )
      .then(() => {
        console.log("Daily watering updated:", payload);
      })
      .catch((err) => console.log(err));
  };

  const handleSignOut = async () => {
    setShowDialog(false);
    try {
      await signOut(); // from your auth context
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  if (Success) {
    return (
      <LinearGradient
        colors={["#0648ffff", "#000000ff"]}
        start={{ x: 1, y: -0.5 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.centered]}
      >
        <Ionicons name="checkmark-circle" size={100} color="#0648ffff" />
        <Text variant="headlineMedium" style={styles.successText}>
          Dispense Successful!
        </Text>
        <Text style={styles.successSub}>
          Your water has been dispensed successfully.
        </Text>

        <Button
          mode="contained"
          onPress={() => setSuccess(false)}
          style={styles.closeButton}
          labelStyle={{ color: "#fff", fontWeight: "bold" }}
        >
          Close
        </Button>
      </LinearGradient>
    );
  }

  return (
    <>
      <View></View>
      <LinearGradient
        colors={["#00c97f", "#0044ff", "#000000"]}
        locations={[0, 0.3, 0.4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              LeafMeBe
            </Text>
            <FontAwesome
              name="sign-out"
              size={40}
              color="white"
              onPress={() => setShowDialog(true)}
            />
          </View>

          {/* Water dispense section */}
          <View style={styles.content_container}>
            <Text variant="headlineSmall" style={styles.content_title}>
              Water To Dispense
            </Text>

            <View style={styles.row_container}>
              <Ionicons name="water" size={45} color="#0044ff" />
              <View style={styles.segmented_container}>
                <SegmentedButtons
                  value={Water}
                  theme={{
                    colors: {
                      onSurface: "#FFFFFF",
                      outline: "#0044ff",
                      surface: "#333333",
                    },
                  }}
                  onValueChange={(value) => {
                    setWater(value);
                    axios.put(
                      "https://leafmebe-1.onrender.com/api/water/device-state/target",
                      { target_ml: Number(value) }
                    );
                  }}
                  buttons={water_dispensed.map((water) => ({
                    value: water,
                    label: water,
                  }))}
                />
                <View style={styles.dailyRow}>
                  <Text style={styles.dailyLabel}>Daily Watering</Text>
                  <Switch
                    value={dailyWatering}
                    ios_backgroundColor="#444" // background color when OFF (iOS)
                    trackColor={{ false: "#444", true: "#0044ff" }}
                    thumbColor={dailyWatering ? "white" : "#888"}
                    onValueChange={(value) => {
                      setDailyWatering(value);

                      updateDailyWatering(value);
                    }}
                  />
                </View>

                <Button
                  mode="contained"
                  disabled={dailyWatering || !Water}
                  onPress={handleSubmit}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  style={
                    dailyWatering || !Water
                      ? { borderRadius: 25, backgroundColor: "grey" }
                      : { borderRadius: 25, backgroundColor: "#0044ff" }
                  }
                >
                  Manual Dispense
                </Button>
                {dailyWatering && (
                  <Text style={{ color: "#aaa" }}>
                    Daily watering is active — manual watering is disabled.
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Total water */}
          <TotalWater total={totalWater} />

          <SummaryChart></SummaryChart>
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "900",
                marginBottom: 1,
                color: "white",
              }}
            >
              Articles
            </Text>
            {articlesData.map((a) => (
              <Article key={a.id} article={a} />
            ))}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </LinearGradient>

      {/* Sign-out confirmation dialog */}

      <Modal
        visible={showDialog}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
        onRequestClose={() => setShowDialog(false)}
      >
        {/* Bottom sheet container */}

        <Pressable onPress={() => setShowDialog(false)}>
          <View
            style={{
              backgroundColor: "transparent",
              height: "730",
            }}
          ></View>
        </Pressable>

        <View
          style={{
            backgroundColor: "transparent",
            paddingVertical: 20,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            marginRight: -15,
            marginLeft: -15,
          }}
        >
          {/* Log Out */}
          <Button
            mode="contained"
            onPress={handleSignOut}
            style={{
              marginHorizontal: 20,
              borderRadius: 12,
              backgroundColor: "#2c2c2e",
              borderWidth: 1,
            }}
            contentStyle={{ width: "100%" }}
            labelStyle={{
              fontSize: 18,
              fontWeight: "700",
              color: "#de3232ff",
            }}
          >
            Log Out
          </Button>

          {/* Cancel */}
          <Button
            mode="contained"
            onPress={() => setShowDialog(false)}
            style={{
              marginHorizontal: 20,
              marginTop: 10,
              borderRadius: 12,
              backgroundColor: "#2c2c2e",
            }}
            contentStyle={{ width: "100%" }}
            labelStyle={{
              fontSize: 18,
              fontWeight: "900",
              color: "#548affff",
            }}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  container_log_out: { flex: 1, padding: 0 },
  scrollContent: { gap: 30, marginTop: 70 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 35, fontWeight: "900" },
  content_container: {
    flexDirection: "column",
    gap: 20,
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 20,
  },
  content_title: { fontSize: 15, fontWeight: "bold", color: "#C7C7C7" },
  row_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  segmented_container: { flexDirection: "column", flex: 1, gap: 5 },
  centered: { justifyContent: "center", alignItems: "center" },
  successText: { color: "#fff", marginTop: 20, fontWeight: "bold" },
  successSub: { color: "#ccc", marginTop: 10, textAlign: "center" },
  closeButton: {
    marginTop: 30,
    backgroundColor: "#0648ffff",
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },

  dailyLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
