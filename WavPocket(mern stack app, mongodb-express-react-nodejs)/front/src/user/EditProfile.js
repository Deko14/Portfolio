import React, { Component } from "react";
import { Redirect } from "react-router";
import { isAuthenticated } from "../auth";
import { read, update, updateUserRealTime } from "./apiUser";
import profilepic from "../images/profilepic.png";
import DeleteUser from "./DeleteUser";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      description: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          description: data.description,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    // console.log("user id from route params: ", this.props.match.params.userId);
    // console.log("Authenticated method: ", isAuthenticated());
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 250000) {
      this.setState({ error: "File size should be less than 250kb" });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required!" });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid email is required!" });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: "Password must be atleast 6 characters long!" });
      return false;
    }
    return true;
  };

  handleChange = (param) => (event) => {
    this.setState({ error: "" });
    const value =
      param === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = param === "photo" ? event.target.files[0].size : 0;
    this.userData.set(param, value);
    this.setState({ [param]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    if (this.isValid()) {
      this.setState({ loading: true });
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          updateUserRealTime(data, () => {
            this.setState({ redirectToProfile: true });
          });
        }
      });
    }
  };

  render() {
    const {
      id,
      name,
      email,
      description,
      // password,
      redirectToProfile,
      error,
      loading,
    } = this.state;
    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : profilepic;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <div className="editprofile">
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
        <div className="container">
          <div className="error" style={{ display: error ? "block" : "none" }}>
            {error}
          </div>
          <div className="mid">
            <div className="picnbutton">
              <img
                src={photoUrl}
                onError={(i) => {
                  i.target.src = `${profilepic}`;
                }}
                alt={name}
                className="defImg"
              />
              <DeleteUser userId={id} />
            </div>
            <form>
              <div className="form-group">
                <label className="lable first">Profile photo</label>
                <input
                  onChange={this.handleChange("photo")}
                  type="file"
                  accept="image/*"
                />
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
                <label className="lable first">Description</label>
                <input
                  onChange={this.handleChange("description")}
                  type="text"
                  value={description}
                />
              </div>
              {/* <div className="form-group">
                <label>Password</label>
                <input
                  onChange={this.handleChange("password")}
                  type="password"
                  value={password}
                />
              </div> */}

              <button onClick={this.clickSubmit} className="button-container">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
