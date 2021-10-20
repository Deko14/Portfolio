import React, { Component } from "react";
import { list } from "./apiUser";
import profilepic from "../images/profilepic.png";
import { Link } from "react-router-dom";

export default class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  render() {
    const { users } = this.state;

    return (
      <div className="users">
        <div className="container">
          <div className="cards">
            {users.map((user, i) => (
              <div key={i} className="card">
                <div className="picture">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                    onError={i => {i.target.src = `${profilepic}`}}
                    alt={user.name}
                    className="defImg"
                  />
                </div>
                <div className="content">
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <Link to={`/user/${user._id}`}>
                    <button>View Profile</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
