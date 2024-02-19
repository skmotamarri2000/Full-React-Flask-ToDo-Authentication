import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button,
  Card as FlowbiteCard,
} from "flowbite-react";
import axios from "axios";

class TodoHome extends Component {
  state = {
    quote: "",
    username: "",
  };

  componentDidMount() {
    this.fetchQuote();
    this.fetchCurrentUser();
    this.interval = setInterval(this.fetchQuote, 9000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchQuote = () => {
    axios
      .get("https://api.adviceslip.com/advice")
      .then((response) => {
        const { advice } = response.data.slip;
        this.setState({ quote: advice });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/api/current-user");
      this.setState({ username: response.data.username });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="h-full overflow-hidden">
        <div className="flex justify-end mt-8">
          <Navbar fluid rounded>
            <NavbarToggle />
            <NavbarCollapse>
              <NavbarLink
                as={Link}
                to="/dashboard"
                active
                className="text-lg text-black-700"
              >
                Home
              </NavbarLink>

              <NavbarLink
                as={Link}
                to="/login"
                className="text-lg text-black-700"
              >
                Logout
              </NavbarLink>
            </NavbarCollapse>
          </Navbar>
        </div>

        <div className="flex justify-center mt-20 ">
          <h1 className="text-6xl text-center tracking-tight text-black-500 dark:text-white font-serif">
            Welcome{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              {this.state.username}
            </span>
            !
          </h1>
        </div>

        <div className="flex justify-center mt-36">
          <div className="max-w-md">
            <FlowbiteCard className="w-full">
              <h5 className="text-2xl italic tracking-tight text-gray-900 dark:text-white">
                {this.state.quote}
              </h5>
              <Button
                as={Link}
                to="/todo"
                className="w-full text-1xl text-white"
              >
                Go to Tasks
              </Button>
            </FlowbiteCard>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoHome;
