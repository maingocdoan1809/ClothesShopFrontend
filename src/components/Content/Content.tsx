import { useMemo, useState } from "react";
import ValidInput from "../ValidInput/ValidInput";
import style from "./content.module.css";

import classNames from "classnames/bind";
import { BACKEND_URL } from "../../env";
const cx = classNames.bind(style);

function Content() {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState<boolean | undefined>(
    undefined
  );
  console.log(password);
  return (
    <div className={`${style.content}`}>
      {useMemo(
        () => (
          <ValidInput
            key={1}
            callBack={async (text: string) => {
              if (text == "") {
                setIsValid(undefined);
                setUsername("");
                return;
              }
              const data = await fetch(BACKEND_URL, {
                method: "get",
              });
              const json = await data.json();
              setIsValid(text == json.username);
              setUsername(text);
            }}
            isValid={isValid}
            className={["1"]}
          />
        ),
        [isValid]
      )}
      {useMemo(
        () => (
          <ValidInput
            key={2}
            callBack={(text: string) => {
              setPassword(text);
            }}
          />
        ),
        []
      )}

      <div className={cx("test")}></div>
    </div>
  );
}

export default Content;
