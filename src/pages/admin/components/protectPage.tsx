import { useEffect } from "react";

type TProps = {
  children: any;
  push: any;
};
const ProtectPage = ({ children, push }: TProps) => {
  const checkToken = () => {
    const token = sessionStorage.getItem("rest-token");
    if (!token) {
      push("/admin");
      return <div>Sin acceso</div>;
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return <>{children}</>;
};

export default ProtectPage;
