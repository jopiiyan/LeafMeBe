import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setconfirmPass] = useState<string>("");
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

  const handleSwitchMode = () => {
    setIsSignup((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {" "}
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back!"}{" "}
        </Text>
        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
          theme={{
            colors: {
              primary: "#0e7e64ff",
              background: "#E0F2F1",
              outline: "#0e7e64ff",
            },
          }}
        ></TextInput>
        <TextInput
          label="Password"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          theme={{
            colors: {
              primary: "#0e7e64ff",
              background: "#E0F2F1",
              outline: "#0e7e64ff",
            },
          }}
        ></TextInput>
        {isSignUp && (
          <TextInput
            label="Confirm Password"
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
            onChangeText={setconfirmPass}
            secureTextEntry
            theme={{
              colors: {
                primary: "#0e7e64ff",
                background: "#E0F2F1",
                outline: "#0e7e64ff",
              },
            }}
          ></TextInput>
        )}

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        <Button
          mode="contained"
          onPress={handleAuth}
          style={styles.button}
          theme={{
            colors: {
              primary: "#0e7e64ff",
              outline: "#0e7e64ff",
            },
          }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <Button
          mode="text"
          onPress={handleSwitchMode}
          theme={{
            colors: {
              primary: "#0e7e64ff",
              outline: "#0e7e64ff",
            },
          }}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Dont have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
    fontSize: 35,
    color: "#014535ff",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
