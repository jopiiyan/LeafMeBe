import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined); //treat this like an empty box

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true); //we always check at first whether it is user or not

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
    return "An error occured during signup";
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password); //waiting for creation of email and password
      await getUser();
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
    return "An error occured during sign in";
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      return null;
    } catch (error) {
      console.log(error);
    }
    return "an error has occured during sign out";
  };

  return (
    <AuthContext.Provider //this is the part where we fill the Authcontext
      value={{ isLoadingUser, user, signUp, signIn, signOut }} //its like saying: everything inside me, the children, can use the function signup and sign in
    >
      {children}
    </AuthContext.Provider> //every react context come with a provider
  );
}

export function useAuth() {
  const context = useContext(AuthContext); // we open the box
  if (context === undefined) {
    throw new Error("useAuth must be inside of Authprovider");
  }
  return context;
}
