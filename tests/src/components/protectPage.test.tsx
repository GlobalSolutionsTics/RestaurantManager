import ProtectPage from "@/pages/admin/components/protectPage";
import store from "@/store/store";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

const mockToken = {
  exp: 1657303200,
  sub: "usuario123",
  iss: "mi_iss",
};

type TProps = {
  push: jest.Mock;
  requiredProfiles: string;
  token: any;
};

const INITAL_DATA_INVALID: TProps = {
  push: jest.fn(),
  requiredProfiles: "cocina",
  token: "fakeToken",
};

const INITAL_DATA_NULL: TProps = {
  push: jest.fn(),
  requiredProfiles: "cocina",
  token: mockToken,
};

type WrapperProps = {
  children: any;
};

const Wrapper = ({ children }: WrapperProps) => {
  return <Provider store={store}>{children}</Provider>;
};
//TODO: Crate new unit testing for this
describe.skip("ProtectPage", () => {
  it("[OK] Render correctly", () => {
    render(
      <ProtectPage
        push={INITAL_DATA_INVALID.push}
        requiredProfiles={INITAL_DATA_INVALID.requiredProfiles}
      >
        Children Content
      </ProtectPage>,
      { wrapper: Wrapper },
    );
    expect(INITAL_DATA_INVALID.push).toHaveBeenCalledWith("/admin");
  });
  it("[OK] Render correctly", () => {
    render(
      <ProtectPage
        push={INITAL_DATA_NULL.push}
        requiredProfiles={INITAL_DATA_NULL.requiredProfiles}
      >
        Children Content
      </ProtectPage>,
      { wrapper: Wrapper },
    );
    expect(INITAL_DATA_NULL.push).toHaveBeenCalledWith("/admin");
  });
});
