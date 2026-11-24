import "@testing-library/jest-dom";
import DishBreakdownDialog from "@/components/orders/DishBreakdownDialog";
import { fireEvent, render, screen } from "@testing-library/react";

it("saves different titles as separate lines and groups only matching titles and prices", () => {
  const dish = {
    uuid: "taco",
    name: "Taco",
    type: "comida",
    price: 20,
    isUniquePrice: false,
  };
  const onSave = jest.fn();
  render(
    <DishBreakdownDialog
      dishes={[{ ...dish, number: 3 }]}
      onClose={jest.fn()}
      onSave={onSave}
    />,
  );
  const titles = screen.getAllByRole("textbox", { name: "Título" });
  expect(titles).toHaveLength(3);
  fireEvent.change(titles[1], { target: { value: "Taco especial" } });
  fireEvent.click(screen.getByRole("button", { name: "Actualizar platillos" }));

  expect(onSave).toHaveBeenCalledWith([
    { ...dish, number: 2 },
    { ...dish, name: "Taco especial", number: 1 },
  ]);
});
