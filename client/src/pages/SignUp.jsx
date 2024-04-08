import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all required fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/account/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }
      setLoading(false);
      navigate("/dashboard"); // Redirect to dashboard on successful signup
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full py-8 px-4 bg-white shadow-lg rounded-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label value="Username" />
            <TextInput
              type="text"
              placeholder="Enter your username"
              id="username"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <Label value="Email" />
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <Label value="Password" />
            <TextInput
              type="password"
              placeholder="Enter your password"
              id="password"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <Label value="Last Name" />
            <TextInput
              type="text"
              placeholder="Enter your last name"
              id="last_name"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <Label value="First Name" />
            <TextInput
              type="text"
              placeholder="Enter your first name"
              id="first_name"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <Label value="Address" />
            <TextInput
              type="text"
              placeholder="Enter your address"
              id="address"
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <Label value="Confirm Password" />
            <TextInput
              type="password"
              placeholder="Confirm your password"
              id="confirmPassword"
              onChange={handleChange}
              className="input"
            />
          </div>
          <Button
             className='w-full bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-900  text-white p-2 rounded-md transition duration-300 ease-in-out'
             
            type="submit"
            disabled={loading}

          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account?</span>
          <Link to="/sign-in" className="ml-1 text-blue-500">
            Sign In
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
