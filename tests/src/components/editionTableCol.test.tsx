import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import EditionTableCol from "@/components/editionTableCol";
import { TMenuResponse } from "@/types/menu.types";

const INITAL_DATA: TMenuResponse = {
  name: "Prueba Nombre",
  price: 0.0,
  isUniquePrice: true,
  type: "",
};

/**
 * Example unit testing.
 *
 * El test unitario se realiza principalmente para testear los componentes
 * y verificar el funcionamiento individual esperado
 */

describe("Edition Component Tool", () => {
  it("[OK] Render correctly", () => {
    render(
      <EditionTableCol
        dataTestId='edit-test'
        data={INITAL_DATA}
        handleDelete={() => {}}
      />,
    );
    const EDIT_TABLE = screen.getByTestId("edit-test");
    expect(EDIT_TABLE).toBeInTheDocument();
  });

  it("[OK] Input name is work to change name", () => {
    const { rerender } = render(
      <EditionTableCol
        dataTestId='edit-test'
        data={INITAL_DATA}
        handleDelete={() => {}}
      />,
    );
    const INPUT_NAME = screen.getByTestId("editcol-name");
    expect(INPUT_NAME).toHaveValue("Prueba Nombre");

    fireEvent.change(INPUT_NAME, { target: { value: "Nombre cambiado" } });
    rerender(
      <EditionTableCol
        dataTestId='edit-test'
        data={INITAL_DATA}
        handleDelete={() => {}}
      />,
    );
    expect(INPUT_NAME).toHaveValue("Nombre cambiado");
  });
});

it("uses the kitchen UUID and omits kitchenType when selecting all kitchens", () => {
  const kitchen = { id: "26bcca54-da1a-451c-9e1c-e15b190a40c7", name: "Barra" };
  const handleChange = jest.fn();
  const props = { kitchens: [kitchen], handleChange, handleDelete: jest.fn() };
  const { rerender } = render(
    <EditionTableCol {...props} data={INITAL_DATA} />,
  );
  const select = screen.getByRole("combobox", {
    name: "Cocina perteneciente de Prueba Nombre",
  });

  expect(select).toHaveDisplayValue("Todas las cocinas");
  fireEvent.change(select, { target: { value: kitchen.id } });
  expect(handleChange).toHaveBeenLastCalledWith({
    ...INITAL_DATA,
    kitchenType: kitchen.id,
  });

  rerender(
    <EditionTableCol
      {...props}
      data={{ ...INITAL_DATA, kitchenType: kitchen.id }}
    />,
  );
  expect(select).toHaveDisplayValue("Barra");
  fireEvent.change(select, { target: { value: "" } });
  expect(handleChange.mock.lastCall?.[0]).not.toHaveProperty("kitchenType");
});
