import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";

export default function DevicesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([
    // DEMO DATA
    { name: "LeafMeBe_01", id: "esp32_01", status: "Active" },
  ]);

  const handleAddDevice = () => {
    if (!deviceName || !deviceId) return;

    const newDevice = {
      name: deviceName,
      id: deviceId,
      status: "Inactive", // default for new devices
    };

    setDevices([...devices, newDevice]);
    setDeviceName("");
    setDeviceId("");
    setShowAddModal(false);
  };

  return (
    <LinearGradient
      colors={["#00c97f", "#0044ff", "#000000"]}
      locations={[0, 0.3, 0.4]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <Text style={styles.header}>My Devices</Text>

      {/* Add Device Button */}
      <Button
        icon="plus"
        mode="contained"
        textColor="black"
        style={styles.addButton}
        labelStyle={{ fontWeight: 600 }}
        onPress={() => setShowAddModal(true)}
      >
        Add Device
      </Button>

      {/* Device List */}
      <ScrollView style={{ width: "100%", marginTop: 20 }}>
        {devices.map((dev, index) => (
          <View key={index} style={styles.deviceCard}>
            <Text style={styles.deviceName}>{dev.name}</Text>
            <Text style={styles.deviceId}>{dev.id}</Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    dev.status === "Active" ? "#11ff44ff" : "#ff4444",
                },
              ]}
            >
              <Text style={styles.statusText}>{dev.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Device Modal */}
      <Modal transparent visible={showAddModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Device</Text>

            <TextInput
              placeholder="Device Name (e.g. LeafMeBe_02)"
              placeholderTextColor="#888"
              style={styles.input}
              value={deviceName}
              onChangeText={setDeviceName}
            />

            <TextInput
              placeholder="Device ID (backend ID)"
              placeholderTextColor="#888"
              style={styles.input}
              value={deviceId}
              onChangeText={setDeviceId}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#0044ff" }]}
                onPress={handleAddDevice}
              >
                <Text style={styles.modalBtnText}>Add</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#999" }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
  },
  header: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#0044ff",
    width: 160,
    alignSelf: "center",
    borderRadius: 30,
  },
  deviceCard: {
    backgroundColor: "#1b1b1b",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
  },
  deviceId: {
    fontSize: 14,
    color: "#bbbbbb",
    marginTop: 5,
  },
  statusBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "black",
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 30,
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 12,
    color: "white",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 10,
  },
  modalBtn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalBtnText: {
    color: "black",
    fontWeight: "800",
    fontSize: 16,
  },
});
