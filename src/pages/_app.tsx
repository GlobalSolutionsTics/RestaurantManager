import "@/styles/setup.css";
import "dayjs/locale/es";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "@/store/store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { esES } from "@mui/x-date-pickers/locales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale='es'
        localeText={
          esES.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <Component {...pageProps} />
      </LocalizationProvider>
    </Provider>
  );
}
