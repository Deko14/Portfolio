import React, { Component } from "react";
import logo from "../images/logo1.png";
import { Icon } from "@iconify/react";
import { signup } from "../auth";
import {Link} from "react-router-dom";

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false
    };
  }

  handleChange = (param) => (event) => {
    this.setState({ error: "" });
    this.setState({ [param]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password,
    };
    // console.log(user);
    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else this.setState({ error: "", name: "", email: "", password: "", open: "true" });
    });
  };

  render() {
    const { name, email, password, error, open } = this.state;

    return (
      <div className="sign">
        <form>
          <img src={logo} alt="Logo" className="logo" />
          <h2>Sign Up</h2>

          <div className="error" style={{ display: error ? "block" : "none" }}>
            {error}
          </div>

          <div className="success" style={{ display: open ? "block" : "none" }}>
            Account created. Please <Link to="/signin">Sign In</Link>.
          </div>

          <div className="form-group">
            <label className="lable first">Arist name</label>
            <input
              onChange={this.handleChange("name")}
              type="text"
              value={name}
            />
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
            Create Account
          </button>
          <hr />
          <p>Or sign up using</p>
          <Icon icon="flat-color-icons:google" className="gicon" />
        </form>
      </div>
    );
  }
}
