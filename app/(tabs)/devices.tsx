import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

// Types
interface Device {
  name: string;
  id: string;
  status: "Active" | "Inactive" | "Configuring";
  ipAddress?: string;
  lastSeen?: string;
}

// Storage key for devices
const DEVICES_STORAGE_KEY = "@leafmebe_devices";

// Your backend server URL
const SERVER_BASE = "https://leafmebe-1.onrender.com/api/water";

export default function DevicesPage() {
  // State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProvisioningModal, setShowProvisioningModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [provisioningStep, setProvisioningStep] = useState(1);

  // ESP32 AP Configuration
  const ESP32_AP_SSID = "LeafMeBe_Setup";
  const ESP32_AP_PASSWORD = "leafmebe123";
  const ESP32_CONFIG_URL = "http://192.168.4.1";

  // Load devices from storage on mount
  useEffect(() => {
    loadDevices();
  }, []);

  // Load devices from AsyncStorage
  const loadDevices = async () => {
    try {
      const storedDevices = await AsyncStorage.getItem(DEVICES_STORAGE_KEY);
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save devices to AsyncStorage
  const saveDevices = async (deviceList: Device[]) => {
    try {
      await AsyncStorage.setItem(
        DEVICES_STORAGE_KEY,
        JSON.stringify(deviceList),
      );
    } catch (error) {
      console.error("Error saving devices:", error);
    }
  };

  // Refresh device statuses using axios
  const refreshDevices = async () => {
    if (devices.length === 0) {
      setIsRefreshing(false);
      return;
    }

    setIsRefreshing(true);

    try {
      // Call backend to get status
      const response = await axios.get(`${SERVER_BASE}/device-state/status`);
      const { status } = response.data; // status is 0 or 1

      // Update all devices based on the status from MySQL
      const updatedDevices = devices.map((device) => {
        if (status === 1) {
          // Device is active - update lastSeen
          return {
            ...device,
            status: "Active" as const,
            lastSeen: new Date().toISOString(),
          };
        } else {
          // Device is inactive - keep the previous lastSeen (don't update it)
          return {
            ...device,
            status: "Inactive" as const,
            // lastSeen stays the same - only updates when active
          };
        }
      });

      setDevices(updatedDevices);
      await saveDevices(updatedDevices);
    } catch (error) {
      console.error("Error fetching device status:", error);
      // On error, mark all devices as inactive but keep lastSeen
      const updatedDevices = devices.map((device) => ({
        ...device,
        status: "Inactive" as const,
      }));
      setDevices(updatedDevices);
      await saveDevices(updatedDevices);
    }

    setIsRefreshing(false);
  };

  // Manual add device (legacy method)
  const handleAddDevice = () => {
    if (!deviceName || !deviceId) return;

    const newDevice: Device = {
      name: deviceName,
      id: deviceId,
      status: "Inactive",
    };

    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);
    saveDevices(updatedDevices);

    setDeviceName("");
    setDeviceId("");
    setShowAddModal(false);
  };

  // Start ESP32 provisioning flow
  const startProvisioning = () => {
    setProvisioningStep(1);
    setShowProvisioningModal(true);
  };

  // Open WiFi settings
  const openWiFiSettings = () => {
    Linking.openSettings();
  };

  // Open ESP32 configuration page
  const openConfigPage = async () => {
    try {
      await WebBrowser.openBrowserAsync(ESP32_CONFIG_URL, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: "#00c97f",
        toolbarColor: "#000000",
      });
    } catch (error) {
      Linking.openURL(ESP32_CONFIG_URL);
    }
  };

  // Check if device was configured successfully
  const checkDeviceConfigured = async () => {
    setProvisioningStep(4);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      Alert.alert(
        "Configuration Complete",
        "Your device should now be connected to your WiFi network. Please reconnect to your home WiFi and pull down to refresh the device list.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowProvisioningModal(false);
              const newDevice: Device = {
                name: "LeafMeBe Device",
                id: `esp32_${Date.now()}`,
                status: "Inactive",
              };
              const updatedDevices = [...devices, newDevice];
              setDevices(updatedDevices);
              saveDevices(updatedDevices);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Note",
        "Please reconnect to your home WiFi network. The device will appear once it connects successfully.",
      );
      setShowProvisioningModal(false);
    }
  };

  // Delete device - with confirmation
  const deleteDevice = (deviceId: string, deviceName: string) => {
    Alert.alert(
      "Delete Device",
      `Are you sure you want to remove "${deviceName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedDevices = devices.filter((d) => d.id !== deviceId);
            setDevices(updatedDevices);
            saveDevices(updatedDevices);
          },
        },
      ],
    );
  };

  // Render provisioning step content
  const renderProvisioningStep = () => {
    switch (provisioningStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 1: Power On Device</Text>
            <Text style={styles.stepDescription}>
              Make sure your LeafMeBe device is powered on. If it's a new device
              or has been reset, it will automatically create a WiFi hotspot.
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Hotspot Name:</Text>
              <Text style={styles.infoValue}>{ESP32_AP_SSID}</Text>
              <Text style={styles.infoLabel}>Password:</Text>
              <Text style={styles.infoValue}>{ESP32_AP_PASSWORD}</Text>
            </View>
            <Button
              mode="contained"
              style={styles.stepButton}
              labelStyle={styles.stepButtonLabel}
              onPress={() => setProvisioningStep(2)}
            >
              Next
            </Button>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 2: Connect to Device</Text>
            <Text style={styles.stepDescription}>
              Open your phone's WiFi settings and connect to the device's
              hotspot:
            </Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Network:</Text>
              <Text style={styles.infoValue}>{ESP32_AP_SSID}</Text>
              <Text style={styles.infoLabel}>Password:</Text>
              <Text style={styles.infoValue}>{ESP32_AP_PASSWORD}</Text>
            </View>
            <Button
              mode="contained"
              style={styles.stepButton}
              labelStyle={styles.stepButtonLabel}
              onPress={openWiFiSettings}
            >
              Open WiFi Settings
            </Button>
            <Button
              mode="outlined"
              style={[styles.stepButton, styles.outlinedButton]}
              labelStyle={styles.outlinedButtonLabel}
              onPress={() => setProvisioningStep(3)}
            >
              I'm Connected
            </Button>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 3: Configure Device</Text>
            <Text style={styles.stepDescription}>
              Now open the configuration page to enter your home WiFi
              credentials and set up your device.
            </Text>
            <Button
              mode="contained"
              style={styles.stepButton}
              labelStyle={styles.stepButtonLabel}
              onPress={openConfigPage}
            >
              Open Configuration Page
            </Button>
            <Text style={styles.stepHint}>
              After saving the configuration, the device will restart and
              connect to your home WiFi.
            </Text>
            <Button
              mode="outlined"
              style={[styles.stepButton, styles.outlinedButton]}
              labelStyle={styles.outlinedButtonLabel}
              onPress={checkDeviceConfigured}
            >
              I've Configured the Device
            </Button>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <ActivityIndicator size="large" color="#00c97f" />
            <Text style={[styles.stepTitle, { marginTop: 20 }]}>
              Finalizing Setup...
            </Text>
            <Text style={styles.stepDescription}>
              Please wait while we verify the device configuration.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  // Get status color
  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "Active":
        return "#11ff44";
      case "Inactive":
        return "#ff4444";
      case "Configuring":
        return "#ffaa00";
      default:
        return "#888888";
    }
  };

  // Format last seen date
  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "Never";
    return new Date(lastSeen).toLocaleString();
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#00c97f", "#0044ff", "#000000"]}
        locations={[0, 0.3, 0.4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, styles.centerContent]}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

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
      <View style={styles.buttonRow}>
        <Button
          icon="wifi"
          mode="contained"
          textColor="white"
          style={[styles.addButton, styles.primaryButton]}
          labelStyle={{ fontWeight: "600" }}
          onPress={startProvisioning}
        >
          Add ESP32 Device
        </Button>
      </View>

      {/* Device List */}
      <ScrollView
        style={{ width: "100%", marginTop: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshDevices}
            tintColor="#00c97f"
          />
        }
      >
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🌱</Text>
            <Text style={styles.emptyStateTitle}>No Devices Yet</Text>
            <Text style={styles.emptyStateText}>
              Tap "Add ESP32 Device" to set up your first self-watering device.
            </Text>
          </View>
        ) : (
          devices.map((dev, index) => (
            <View key={index} style={styles.deviceCard}>
              {/* Device Header */}
              <View style={styles.deviceHeader}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{dev.name}</Text>
                  <Text style={styles.deviceId}>{dev.id}</Text>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(dev.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{dev.status}</Text>
                </View>
              </View>

              {/* Last Seen - only shows if there's a lastSeen value */}
              <Text style={styles.deviceLastSeen}>
                Last active: {formatLastSeen(dev.lastSeen)}
              </Text>

              {/* Action Buttons Row - Only Delete button */}
              <View style={styles.deviceActions}>
                <Button
                  mode="text"
                  textColor="#ff4444"
                  compact
                  icon="delete"
                  onPress={() => deleteDevice(dev.id, dev.name)}
                >
                  Delete
                </Button>
              </View>
            </View>
          ))
        )}

        {/* Help text */}
        {devices.length > 0 && (
          <Text style={styles.helpText}>
            Pull down to refresh device status
          </Text>
        )}
      </ScrollView>

      {/* ESP32 Provisioning Modal */}
      <Modal
        transparent
        visible={showProvisioningModal}
        animationType="slide"
        onRequestClose={() => setShowProvisioningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.provisioningModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Device</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowProvisioningModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.progressDot,
                    provisioningStep >= step && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>

            {renderProvisioningStep()}
          </View>
        </View>
      </Modal>

      {/* Manual Add Device Modal (Legacy) */}
      <Modal transparent visible={showAddModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Device Manually</Text>

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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  addButton: {
    borderRadius: 30,
  },
  primaryButton: {
    backgroundColor: "#0044ff",
  },

  // Device Card
  deviceCard: {
    backgroundColor: "#1b1b1b",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  deviceInfo: {
    flex: 1,
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
  deviceLastSeen: {
    fontSize: 11,
    color: "#666",
    marginTop: 8,
  },
  deviceActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "black",
    fontWeight: "900",
    fontSize: 12,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  // Help text
  helpText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 30,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 25,
    margin: 30,
  },
  provisioningModal: {
    backgroundColor: "#111",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  // Progress dots
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  progressDotActive: {
    backgroundColor: "#00c97f",
  },

  // Step content
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 15,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  stepHint: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  stepButton: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#0044ff",
  },
  stepButtonLabel: {
    fontWeight: "700",
    paddingVertical: 4,
  },
  outlinedButton: {
    backgroundColor: "transparent",
    borderColor: "#444",
    borderWidth: 1,
  },
  outlinedButtonLabel: {
    color: "#aaa",
    fontWeight: "600",
  },

  // Info box
  infoBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00c97f",
    marginBottom: 15,
  },

  // Legacy modal inputs
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
