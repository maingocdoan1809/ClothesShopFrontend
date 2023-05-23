import { createContext, useState, useContext, useEffect } from "react";

export type User = {
  accesstimes: number;
  address: string;
  avt: string;
  birthday: string;
  email: string;
  fullname: string;
  origin: string;
  phonenumber: string;
  priority: number;
  token: string;
  username: string;
};

type UserContextType = [
  user: User | undefined,
  setUser: (user: User | undefined) => void
];

const userContext = createContext<UserContextType>([
  undefined,
  (user: User | undefined) => {},
]);
type UserProps = {
  children: React.ReactNode;
};
function UserContext({ children }: UserProps) {
  const [user, setUser] = useState<undefined | User>(undefined);
  useEffect(() => {
    console.log("First render");
    const localuser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(localuser.username ? localuser : undefined);
  }, []);
  useEffect(() => {
    return () => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    };
  }, [user]);
  return (
    <userContext.Provider value={[user, setUser]}>
      {children}
    </userContext.Provider>
  );
}
export function useUser() {
  return useContext(userContext);
}
export default UserContext;
