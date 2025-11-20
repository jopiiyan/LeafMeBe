import { useAuth } from "@/lib/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const theme = useTheme();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Passwords must be at least 6 characters long ");
      return;
    }
    setError(null);

    if (isSignUp) {
      if (password !== confirmPass) {
        setError("Passwords do not match");
        return;
      }
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
    }

    router.replace("./(tabs)");
  };

  return (
    <LinearGradient
      colors={["#00c97f", "#0648ff", "#000000"]}
      locations={[0, 0.35, 0.6]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Log In to Leafmebe"}
          </Text>

          {/* Email */}
          <TextInput
            label="Email"
            placeholder="example@gmail.com"
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
            onChangeText={setEmail}
            theme={{
              colors: {
                primary: "#00c97f",
                background: "#1e1e1e",
                outline: "#0648ff",
                text: "#fff",
                onSurface: "#fff",
              },
            }}
          />

          {/* Password */}
          <TextInput
            label="Password"
            autoCapitalize="none"
            secureTextEntry
            mode="outlined"
            style={styles.input}
            onChangeText={setPassword}
            theme={{
              colors: {
                primary: "#00c97f",
                background: "#1e1e1e",
                outline: "#0648ff",
                text: "#fff",
                onSurface: "#fff",
            
              },
            }}
          />

          {/* Confirm Password (Sign Up Mode) */}
          {isSignUp && (
            <TextInput
              label="Confirm Password"
              autoCapitalize="none"
              secureTextEntry
              mode="outlined"
              style={styles.input}
              onChangeText={setconfirmPass}
              theme={{
                colors: {
                  primary: "#00c97f",
                  background: "#1e1e1e",
                  outline: "#0648ff",
                  text: "#fff",
                  onSurface: "#fff",
                },
              }}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Main Button */}
          <Button
            mode="contained"
            onPress={handleAuth}
            style={styles.authButton}
            contentStyle={{ paddingVertical: 6 }}
            labelStyle={{ color: "white", fontWeight: "bold" }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          {/* Switch Mode */}
          <Button
            mode="text"
            onPress={() => setIsSignup((prev) => !prev)}
            labelStyle={{ color: "#00c97f", fontWeight: "600" }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    borderRadius: 10,
    color: "white",
  },
  authButton: {
    marginTop: 10,
    borderRadius: 25,
    backgroundColor: "#0648ff",
  },
  errorText: {
    color: "#ff4f4f",
    marginBottom: 8,
    fontWeight: "600",
  },
});
