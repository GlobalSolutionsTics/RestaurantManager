import { validateTokneService } from "@/services/auth";
import { IUserRedux, saveUserInRedux } from "@/store/slices/user.slice";
import { TOKEN_ID } from "@/utils/strings";
import { KITCHEN } from "@/utils/users";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;

type TProps = {
  children?: any;
  push: any;
  requiredProfiles: string;
};
const ProtectPage = ({ children, push, requiredProfiles }: TProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let user: IUserRedux;
    try {
      const token = sessionStorage.getItem(TOKEN_ID);
      const payload = token?.split(".")[1];
      if (!payload) {
        push("/admin");
        return;
      }
      user = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      if (!user.type || !requiredProfiles.includes(user.type)) {
        push("/admin");
        return;
      }
      dispatch(
        saveUserInRedux({
          name: user.name,
          type: user.type,
          uuid: user.uuid,
          kitchenType: user.kitchenType,
        }),
      );
    } catch {
      push("/admin");
      return;
    }

    const validateToken = async () => {
      const token = sessionStorage.getItem(TOKEN_ID);
      if (token !== null && !(await validateTokneService(token))) {
        push("/admin");
      }
    };

    void validateToken();
    if (user.type === KITCHEN) return;
    const timeout = setInterval(validateToken, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(timeout);
  }, [dispatch, push, requiredProfiles]);

  return <>{children}</>;
};

export default ProtectPage;
