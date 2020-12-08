import { useContext } from "react";
import AuthContext, { AuthContextInterface } from "./AuthContext";

const useAuth = (): AuthContextInterface => useContext(AuthContext);

export default useAuth;
