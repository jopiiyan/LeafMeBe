import { useAuth } from "@/lib/auth-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import SummaryChart from "../components/SummaryChart";
import TotalWater from "../components/totalWater";

export default function HomeScreen() {
  const water_dispensed = ["50", "100", "150"];
  const [Water, setWater] = useState("");
  const [Success, setSuccess] = useState(false);
  const [totalWater, settotalWater] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const { signOut } = useAuth();

  const water_data = { water: Water };

  useEffect(() => {
    axios
      .get("http://192.168.10.118:8000/api/water/sum")
      .then((res) => {
        settotalWater(res.data);
      })
      .catch((err) => console.log(err));
  }, [Success]);

  const handleSubmit = () => {
    axios
      .post("http://192.168.10.118:8000/api/water/insert", water_data)
      .then(() => {
        setSuccess(true);
        setWater("");
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
                  onValueChange={(value) => setWater(value)}
                  buttons={water_dispensed.map((water) => ({
                    value: water,
                    label: water,
                  }))}
                />

                <Button
                  mode="contained"
                  disabled={!Water}
                  onPress={handleSubmit}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  style={
                    !Water
                      ? { borderRadius: 25, backgroundColor: "grey" }
                      : { borderRadius: 25, backgroundColor: "#0044ff" }
                  }
                >
                  Dispense
                </Button>
              </View>
            </View>
          </View>

          {/* Total water */}
          <TotalWater total={totalWater} />
          <SummaryChart></SummaryChart>
          <View style={{ height: 80 }} />
        </ScrollView>
      </LinearGradient>

      {/* Sign-out confirmation dialog */}
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={{
            position: "absolute",
            bottom: -20,
            left: -35,
            right: -35,
            margin: 0,
            backgroundColor: "transparent",
            padding: 0,
          }}
        >
          <View
            style={{
              backgroundColor: "transparent",
              paddingVertical: 20,
              borderRadius: 25,
              width: "100%",
              paddingHorizontal: 0,
            }}
          >
            {/* Log Out */}
            <Button
              mode="contained"
              onPress={handleSignOut}
              style={{
                marginHorizontal: 20,
                marginTop: 10,
                borderRadius: 12,
                backgroundColor: "#2c2c2e",
                borderWidth: 1,
              }}
              contentStyle={{
                width: "100%",
              }}
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
                marginTop: 3,

                borderRadius: 12,
                backgroundColor: "#2c2c2e",
              }}
              contentStyle={{
                width: "100%",
              }}
              labelStyle={{
                fontSize: 18,
                fontWeight: "900",
                color: "#548affff",
              }}
            >
              Cancel
            </Button>
          </View>
        </Dialog>
      </Portal>
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
});
