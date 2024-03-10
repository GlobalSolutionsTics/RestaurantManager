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
