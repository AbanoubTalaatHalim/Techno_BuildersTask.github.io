import React, { Component } from "react";
import "./main.css";
import image from "./1.png";
import auth from "./auth";
import axios from "axios";

class Profile extends Component {
  state = {
    userImg: "",
    first_name: "",
    age: "",
    phone: "",
  };
  componentDidMount() {
    const sendGetRequest = async () => {
      try {
        const search = this.props.location.search.slice(1);
        let searchParams = JSON.parse(
          '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}'
        );
        const resp = await axios.get(
          `http://41.38.70.8:8003/api/resource/User/${searchParams.user}`,
          {
            headers: {
              Authorization: "token 275fb1801b820b6:64696839002a085",
            },
          }
        );
        const ageDrivenFromBirth =
          new Date().getFullYear() -
          parseInt(resp.data.data.birth_date.slice(0, 4));
        this.setState({
          userImg: resp.data.data.user_image,
          first_name: resp.data.data.first_name,
          age: ageDrivenFromBirth,
          phone: resp.data.data.phone,
        });
        window.myage = resp.data.data.birth_date;
      } catch (err) {
        console.error("ERROR is: ", err);
      }
    };

    sendGetRequest();
  }

  handleLogout = () => {
    auth.logout(() => {
      this.props.history.push("/");
    });
  };
  render() {
    return (
      <>
        <div className="card">
          {/* <img
            className="card-img-top"
            src={this.state.userImg}
            alt="User image"
          /> */}
          <img className="card-img-top" src={image} alt="User image" />
          <div className="card-body">
            <h5 className="card-title">Welcome {this.state.first_name}</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Age: {this.state.age} </li>
            <li className="list-group-item">Phone: {this.state.phone} </li>
          </ul>
          <div className="card-body">
            <button
              type="submit"
              className="btn btn-secondary btn-block"
              onClick={this.handleLogout}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
