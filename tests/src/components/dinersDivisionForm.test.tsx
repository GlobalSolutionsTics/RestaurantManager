import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DinersDivisionForm from "@/components/orders/DinersDivisionForm";
import { StatusEnum } from "@/enums/states.enum";
import { updateDinersDivisionService } from "@/services/order";
import { getOrderDishKey } from "@/utils/groupOrderDishes";
import { TOKEN_ID } from "@/utils/strings";

jest.mock("@/services/order", () => ({
  updateDinersDivisionService: jest.fn().mockResolvedValue({
    error: false,
    message: "Cuenta dividida",
  }),
}));

it("accepts a missing diner count, allocates units separately and saves from the form", async () => {
  const dish = {
    name: "Taco",
    type: "food",
    isUniquePrice: true,
    price: 25,
    number: 3,
  };
  sessionStorage.setItem(TOKEN_ID, "test-token");
  try {
    render(
      <DinersDivisionForm
        order={{
          uuid: "order-id",
          status: StatusEnum.SEND,
          tableNumber: 1,
          name: "",
          dishes: 3,
          dishesDescription: [dish],
        }}
      />,
    );

    fireEvent.change(
      screen.getByRole("spinbutton", { name: /Número de comensales/ }),
      {
        target: { value: "2" },
      },
    );
    fireEvent.change(screen.getByRole("spinbutton", { name: /Taco/ }), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Comensal" }), {
      target: { value: "2" },
    });
    const quantity = screen.getByRole("spinbutton", { name: /Taco/ });
    expect(quantity.getAttribute("max")).toBe("1");
    fireEvent.change(quantity, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "Actualizar pago" }));

    const key = getOrderDishKey(dish);
    await waitFor(() =>
      expect(updateDinersDivisionService).toHaveBeenCalledWith(
        "test-token",
        "order-id",
        {
          diners: 2,
          allocations: [
            { diner: 1, dishes: [{ key, number: 2 }] },
            { diner: 2, dishes: [{ key, number: 1 }] },
          ],
        },
      ),
    );
    expect(await screen.findByText("Cuenta dividida")).toBeTruthy();
  } finally {
    sessionStorage.removeItem(TOKEN_ID);
  }
});
