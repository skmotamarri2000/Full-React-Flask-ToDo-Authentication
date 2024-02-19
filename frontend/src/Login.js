import axios from "axios";
import React, { useState } from "react";
import { Label, TextInput, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/login", formData);
      console.log(response.data);
      if (response.status === 200) {
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token;
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const userInfo = await userInfoResponse.json();
        console.log(userInfo);
        //  name and email extracting from the obtained user info
        const { name, email } = userInfo;

        const response = await axios.post("/google-login", {
          name: name,
          email: email,
        });

        console.log(response.data);
        if (response.status === 200) {
          navigate("/dashboard");
        } else {
          setError("Google login failed");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Google login failed");
      }
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="mb-4">
                <Label htmlFor="username_or_email" value="Username or Email" />
                <TextInput
                  id="username_or_email"
                  type="text"
                  placeholder="username or email"
                  required
                  shadow
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="password" value="Your password" />
                <TextInput
                  id="password"
                  type="password"
                  required
                  shadow
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full text-1xl text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md relative h-10"
                disabled={loading} // Disable button while loading
              >
                {loading && (
                  <Spinner
                    aria-label="Loading"
                    className="absolute inset-0 m-auto "
                  />
                )}
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <button
              className="w-full text-1xl text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md mt-4"
              onClick={() => login()}
            >
              Login in with Google
            </button>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Need an account?{" "}
              </p>
              {/* Use Link for navigation */}
              <Link
                to="/register"
                className="text-1xl text-blue-500 hover:text-blue-600"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
