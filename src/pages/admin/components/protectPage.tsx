import { IUserRedux, saveUserInRedux } from "@/store/slices/user.slice";
import { TOKEN_ID } from "@/utils/strings";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type TProps = {
  children: any;
  push: any;
};
const ProtectPage = ({ children, push }: TProps) => {
  const dispatch = useDispatch();

  const checkToken = () => {
    const token = sessionStorage.getItem(TOKEN_ID);
    if (!token) {
      push("/admin");
      return <div>Sin acceso</div>;
    }
  };

  const generateInfoToken = () => {
    //Token validation
    const token = sessionStorage.getItem(TOKEN_ID);
    if (token) {
      const separate = token.split(".");
      const information = separate[1];
      const decodeInfo: IUserRedux = JSON.parse(atob(information));
      const payloadUser: IUserRedux = {
        name: decodeInfo.name,
        type: decodeInfo.type,
        uuid: decodeInfo.uuid,
      };
      dispatch(saveUserInRedux(payloadUser));
    }
  };

  useEffect(() => {
    checkToken();
    generateInfoToken();
  }, []);

  return <>{children}</>;
};

export default ProtectPage;
