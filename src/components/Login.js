import React, { Component } from "react";
import auth from "./auth";
import "./main.css";
import axios from "axios";
import Joi from "joi-browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {},
  };

  schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();

    if (errors) return;

    //Call Backend
    console.log("submit");
    const { history } = this.props;

    const sendPostRequest = async () => {
      try {
        const resp = await axios.post(
          "http://41.38.70.8:8003/api/method/login",
          {
            usr: this.state.email,
            pwd: this.state.password,
          }
        );
        console.log("response is : ", resp.data);
        console.log("response StatusCode is : ", resp.status);
        if (resp.status === 200) {
          auth.login(() => {
            history.push(`/profile?user=${this.state.email}`);
          });
        }
      } catch (err) {
        //alert("");
        toast("User Not Found !");
      }
    };

    sendPostRequest();
  };

  validate = () => {
    const errors = {};
    //Clone State
    const state = { ...this.state };
    delete state.errors;
    const res = Joi.validate(state, this.schema, { abortEarly: false });
    if (res.error === null) {
      this.setState({ errors: {} });
      return null;
    }

    for (const error of res.error.details) {
      errors[error.path] = error.message;
    }

    //Set State
    this.setState({ errors });
    return errors;
  };

  handleChange = (e) => {
    //Clone
    let state = { ...this.state };
    //Edit
    state[e.currentTarget.name] = e.currentTarget.value;
    //Set state
    this.setState(state);
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="form-box">
            <div className="header-form">
              <h4 className="text-primary text-center">
                <i
                  className="fa fa-user-circle"
                  style={{ fontSize: "110px" }}
                ></i>
              </h4>
              <div className="image"></div>
            </div>
            <div className="body-form">
              <form onSubmit={this.handleSubmit}>
                <div className="input-group mb-3">
                  <div className="input-group-prepend icons">
                    <span className="input-group-text">
                      <i className="fa fa-user"></i>
                    </span>
                  </div>

                  <input
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    autoFocus
                    id="email"
                    type="text"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                  {this.state.errors.email && (
                    <div className="alert alert-danger">
                      {this.state.errors.email}
                    </div>
                  )}
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend icons">
                    <span className="input-group-text">
                      <i className="fa fa-lock"></i>
                    </span>
                  </div>

                  <input
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    className="form-control"
                  />
                  {this.state.errors.password && (
                    <div className="alert alert-danger">
                      {this.state.errors.password}
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-secondary btn-block">
                  LOGIN
                </button>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
