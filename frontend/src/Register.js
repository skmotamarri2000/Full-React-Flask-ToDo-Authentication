import axios from "axios";
import React, { useState } from "react";
import { Label, TextInput, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/register", formData);
      console.log(response.data);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.error === "Username already exists") {
          setErrors({
            ...errors,
            username: "Oops! Username already taken! ",
          });
        } else if (data.error === "Email already exists") {
          setErrors({
            ...errors,
            email: "Email already exists!  Please Login!",
          });
        } else {
          setErrors({ ...errors, global: "Registration failed" });
        }
      } else {
        setErrors({ ...errors, global: "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white font-sans">
              Create your Account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {errors.global && (
                <div className="text-red-500 mb-4">{errors.global}</div>
              )}
              <div className="mb-4">
                <Label
                  htmlFor="username"
                  value="Username"
                  color={errors.username ? "failure" : null}
                />
                <TextInput
                  id="username"
                  type="text"
                  placeholder="Type your username"
                  required
                  shadow
                  onChange={handleChange}
                  helperText={errors.username}
                  color={errors.username ? "failure" : null}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  shadow
                  onChange={handleChange}
                  helperText={errors.email}
                  color={errors.email ? "success" : null}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  required
                  shadow
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="confirmPassword" value="Confirm Password" />
                <TextInput
                  id="confirmPassword"
                  type="password"
                  required
                  shadow
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full text-1xl text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md relative h-10"
                disabled={loading}
              >
                {loading && (
                  <Spinner
                    aria-label="Loading"
                    className="absolute inset-0 m-auto "
                  />
                )}
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Already had an account?{" "}
              </p>
              {/* Use Link for navigation */}
              <Link
                to="/login"
                className="text-1xl text-blue-500 hover:text-blue-600"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
