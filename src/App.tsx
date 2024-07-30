import { useEffect, useState } from "react";
import "./App.css";
import {
  TokenResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";

interface UserProfileType {
  id: string;
  email: string;
  name: string;
  given_name: string;
  picture: string;
  verified_email: boolean;
}

function App() {
  const [user, setUser] =
    useState<
      Omit<TokenResponse, "error" | "error_description" | "error_uri">
    >();
  const [profile, setProfile] = useState<UserProfileType | null>();

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUser(response);
    },
    onError: () => console.log(),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logout = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logout}>Log out</button>
        </div>
      ) : (
        <button onClick={() => login()}>Sign in with Google</button>
      )}
    </>
  );
}

export default App;
