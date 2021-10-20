import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import profilepic from "../images/profilepic.png";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignIn: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignIn: true });
      } else {
        // console.log(data);
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    // console.log("user id from route params: ", this.props.match.params.userId);
    // console.log("Authenticated method: ", isAuthenticated());
    this.init(userId);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignIn, user } = this.state;
    const photoUrl = user._id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${user._id}?${new Date().getTime()}`
      : profilepic;

    if (redirectToSignIn) return <Redirect to="/signin"></Redirect>;

    return (
      <div className="profile">
        <div className="container">
          <div className="content">
            <div className="picture">
              <img src={photoUrl} onError={i => {i.target.src = `${profilepic}`}} alt={user.name} className="defImg" />
            </div>
            <h2>{user.name}</h2>
            <h4><span>E-mail:</span> {user.email}</h4>
            <h6>{user.description}</h6>
            <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            <div className="buttons">
              {isAuthenticated().user &&
                isAuthenticated().user._id === user._id && (
                  <div>
                    <Link className="editbutton" to={`/user/edit/${user._id}`}>
                      Edit Profile
                    </Link>
                    {/* <DeleteUser userId={user._id} /> */}
                    <Link
                      className="createpostbutton"
                      to={`/user/edit/${user._id}`}
                    >
                      Create Post
                    </Link>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
