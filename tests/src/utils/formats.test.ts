import { textToString } from "@/utils/formats";

it.each([undefined, null, 0, NaN, Infinity, -Infinity])(
  "formats %s as cero pesos",
  (value) => expect(textToString(value)).toBe("Cero pesos"),
);

it.each([
  [1, "Un peso"],
  [21, "Veintiún pesos"],
  [200, "Doscientos pesos"],
  [500, "Quinientos pesos"],
  [1000, "Mil pesos"],
  [1_000_000, "Un millón de pesos"],
  [0.01, "Cero pesos con un centavo"],
  [1.005, "Un peso con un centavo"],
  [199.999, "Doscientos pesos"],
  [-16.25, "Menos dieciséis pesos con veinticinco centavos"],
])("formats %s with correct wording and rounding", (value, expected) => {
  expect(textToString(value)).toBe(expected);
});
