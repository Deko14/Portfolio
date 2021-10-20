import React, { Component } from "react";
import logo from "../images/logo1.png";
import { Icon } from "@iconify/react";
import { Redirect } from "react-router";
import { signin, authenticate } from "../auth";

export default class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirect: false,
      loading: false,
    };
  }

  handleChange = (param) => (event) => {
    this.setState({ error: "" });
    this.setState({ [param]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    console.log(user);
    signin(user).then((data) => {
      if (data.error) this.setState({ error: data.error, loading: false });
      else {
        // Authenticate the User and Redirect the User
        authenticate(data, () => {
          this.setState({ redirect: true });
        });
      }
    });
  };

  render() {
    const { email, password, error, redirect, loading } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div className="sign">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          ""
        )}
        <form>
          <img src={logo} alt="Logo" className="logo" />
          <h2>Sign In</h2>

          <div className="error" style={{ display: error ? "block" : "none" }}>
            {error}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              onChange={this.handleChange("email")}
              type="email"
              value={email}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              onChange={this.handleChange("password")}
              type="password"
              value={password}
            />
          </div>

          <button onClick={this.clickSubmit} className="button-container">
            Log In
          </button>
          <hr />
          <p>Or sign up using</p>
          <Icon icon="flat-color-icons:google" className="gicon" />
        </form>
      </div>
    );
  }
}
