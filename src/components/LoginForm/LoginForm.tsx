import React, { useEffect, useState } from "react";
import LabeledInput from "../ValidInput/LabeledInput";
import style from "./loginform.module.css";
import { BACKEND_URL } from "../../env";
import { Navigate, redirect, useNavigate } from "react-router";
import sha256 from "crypto-js/sha256";
import { checkUserIdentity } from "../../utilities/utils";
import LoadingView from "../LoadingView/LoadingView";
import PasswordInput from "../ValidInput/PasswordInput";
import { User, useUser } from "../../contexts/UserContext/UserContext";

export function LoginForm() {
  const [user, setUser] = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [logging, setLogging] = useState(false);
  const [isLogginFail, setIsLogginFail] = useState(false);
  const [isServerErr, setServerError] = useState(false);
  const [isRequired, setIsRequired] = useState<undefined | boolean>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    checkUserIdentity(user)
      .then((response) => {
        // auth ok;
        navigate("/");
      })
      .catch((err) => {
        if (err.err) {
          setServerError(true);
        } else {
          setIsLoggedIn(false);
        }
      });
  }, [user]);
  return isServerErr ? (
    <div className={`${style.servererror} container`}>
      <h1 className="text-danger">Opp! 505</h1>
      <h3>Our server is running into a problem or the connection was lost.</h3>
      <p>We're trying to get it fixed.</p>
    </div>
  ) : (
    <>
      {isLoggedIn == false && (
        <div className={`${style.wrapper}`}>
          <div className={`${style.login}`}>
            <h2>Login</h2>
            <div>
              <LabeledInput
                identifier="username"
                placeholder="Username"
                type="text"
                callBack={(value) => {
                  setIsLogginFail(false);
                  setUsername(value);
                  setIsRequired(undefined);
                }}
                className={[style["top-border"]]}
                delay={0}
              />
              <PasswordInput
                identifier="password"
                placeholder="Password"
                callBack={(value) => {
                  setIsLogginFail(false);
                  setIsRequired(undefined);
                  setPassword(value);
                }}
                className={[style["bottom-border"], "p-3"]}
                delay={0}
              />
            </div>

            {isLogginFail && (
              <div className="alert alert-warning">
                Your username or password is not correct
              </div>
            )}
            {isRequired && (
              <div className="alert alert-secondary">
                Username and Password are required.
              </div>
            )}
            <div className="d-flex justify-content-between">
              <span>Forgot your password?</span>
              <span>
                <a href="">change</a>
              </span>
            </div>
            {logging ? (
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  if (username.trim() == "" || password.trim() == "") {
                    setIsRequired(true);
                  } else {
                    onLogging(
                      username,
                      password,
                      navigate,
                      setLogging,
                      setUser,
                      setIsLogginFail,
                      setServerError
                    )(e);
                  }
                }}
                className="btn btn-primary"
              >
                Login
              </button>
            )}
            <a href="/register" className="btn btn-outline-secondary">
              Or Sign up
            </a>
            <div className="text-secondary">
              @copyright: {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
      {isLoggedIn == undefined && (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <LoadingView />
        </div>
      )}
    </>
  );
}

function onLogging(
  username: string,
  password: string,
  navigae: (to: string) => void,
  logging: (isLogging: boolean) => void,
  loginOk: (user: User | undefined) => void,
  loginFail: (param: boolean) => void,
  serverError: (param: boolean) => void
) {
  return (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    logging(true);
    fetch(BACKEND_URL + "/login", {
      method: "POST",
      body: JSON.stringify({
        username: sha256(username).toString(),
        password: sha256(password).toString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated == true) {
          localStorage.setItem("user", JSON.stringify(data));
          loginOk(data as User);
          if (data.priority == 1) {
            navigae("/admin");
          } else {
            navigae("/");
          }
        } else if (data.err) {
          serverError(true);
        } else {
          loginFail(true);
        }
      })
      .finally(() => {
        logging(false);
      });
  };
}
