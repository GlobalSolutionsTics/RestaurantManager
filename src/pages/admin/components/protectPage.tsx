import { IUserRedux, saveUserInRedux } from "@/store/slices/user.slice";
import { TOKEN_ID } from "@/utils/strings";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type TProps = {
  children?: any;
  push: any;
  requiredProfiles: string;
  token: any;
};
const ProtectPage = ({ children, push, requiredProfiles, token }: TProps) => {
  const dispatch = useDispatch();
  const userStore: IUserRedux = useSelector((store: any) => store.user);
  const userProfile = userStore.type;

  const checkToken = () => {
    if (!token || !userProfile || !requiredProfiles.includes(userProfile)) {
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
    const timeOut = setTimeout(
      () => {
        if (userProfile !== "cocina") {
          push("/admin");
        }
      },
      5 * 60 * 1000,
    );
    return () => clearTimeout(timeOut);
  }, []);

  return <>{children}</>;
};

export default ProtectPage;
