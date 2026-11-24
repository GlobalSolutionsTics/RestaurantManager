import { groupOrderDishes } from "@/utils/groupOrderDishes";
import { render, screen, within } from "@testing-library/react";
import OrderDishSummary from "@/components/orders/OrderDishSummary";
import { OrdersDishesStatus } from "@/enums/orders.enum";

const taco = {
  uuid: "taco",
  name: "Taco",
  price: 20,
  type: "comida",
  isUniquePrice: true,
};

it("shows repeated dishes on one row and counts ready and pending separately", () => {
  render(
    <OrderDishSummary
      dishes={[
        { ...taco, number: 2, status: OrdersDishesStatus.READY },
        { ...taco, number: 1, status: OrdersDishesStatus.ACTIVE },
        { ...taco, number: 3, status: OrdersDishesStatus.ACTIVE },
      ]}
    />,
  );
  const row = screen.getByRole("row", { name: "Taco 4 2" });
  expect(
    within(row)
      .getAllByRole("cell")
      .map((cell) => cell.textContent),
  ).toEqual(["4", "2"]);
  expect(screen.getAllByRole("rowheader", { name: "Taco" })).toHaveLength(1);
});

it("keeps customized dish names separate even if they share a menu UUID", () => {
  render(
    <OrderDishSummary
      dishes={[
        { ...taco, name: "Taco sin cebolla", number: 1 },
        { ...taco, number: 2, status: OrdersDishesStatus.ACTIVE },
      ]}
    />,
  );
  expect(
    screen.getByRole("row", { name: "Taco sin cebolla 1 0" }),
  ).toBeTruthy();
  expect(screen.getByRole("row", { name: "Taco 2 0" })).toBeTruthy();
});

it("sums quantities across statuses while keeping different unit prices separate", () => {
  const dishes = [
    { ...taco, number: 2, status: OrdersDishesStatus.READY },
    { ...taco, number: 3, status: OrdersDishesStatus.ACTIVE },
    { ...taco, number: 1, price: 25 },
  ];
  const groups = groupOrderDishes(dishes);
  expect(groups).toEqual([
    expect.objectContaining({ name: "Taco", number: 5, price: 20 }),
    expect.objectContaining({ name: "Taco", number: 1, price: 25 }),
  ]);
  expect(
    groups.reduce((total, dish) => total + dish.number * dish.price, 0),
  ).toBe(125);
});
