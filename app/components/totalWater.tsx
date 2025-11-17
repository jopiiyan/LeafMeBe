import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type TotalWaterProps = {
  total: { Sum: number };
};

export default function TotalWater({ total }: TotalWaterProps) {
  return (
    <View style={styles.content_container}>
      <Text variant="headlineSmall" style={styles.content_title}>
        Total Water Dispensed Today
      </Text>

      <View style={styles.row_container}>
        <FontAwesome5 name="water" size={45} color="#0044ff" />
        <View>
          <Text style={styles.waterInfo}>
            {total.Sum === null ? 0 : total.Sum} ML
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  waterInfo: {
    fontSize: 50,
    fontWeight: "800",
    color: "white",
  },
});
