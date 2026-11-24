import "@testing-library/jest-dom";
import OrderReviewTour from "@/components/orders/OrderReviewTour";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

const cookieName = "restaurant-review-tour-finish-mesero";
const store = configureStore({ reducer: { user: () => ({ uuid: "mesero" }) } });

function renderTour() {
  return render(
    <Provider store={store}>
      <h1 id='order-review-tour-title' data-review-tour='details'>
        Revisar orden
      </h1>
      <div data-review-tour='notes'>Notas</div>
      <div data-review-tour='dishes'>Platillos</div>
      <div data-review-tour='breakdown'>Desglosar platillos</div>
      <div data-review-tour='submit'>Enviar orden</div>
      <OrderReviewTour screen='finish' />
    </Provider>,
  );
}

afterEach(() => {
  document.cookie = `${cookieName}=; Max-Age=0; Path=/`;
});

it("starts automatically, only records completion, and can be restarted", async () => {
  const first = renderTour();
  expect(await screen.findByText(/comprueba la mesa/i)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Cerrar tour" }));
  expect(document.cookie).not.toContain(cookieName);

  fireEvent.click(screen.getByRole("button", { name: "Abrir tour de ayuda" }));
  for (let step = 0; step < 4; step++) {
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  }
  fireEvent.click(screen.getByRole("button", { name: "Finalizar tour" }));
  expect(document.cookie).toContain(`${cookieName}=1`);

  first.unmount();
  renderTour();
  expect(screen.queryByText(/comprueba la mesa/i)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Abrir tour de ayuda" }));
  expect(await screen.findByText(/comprueba la mesa/i)).toBeVisible();
});
