export const uniquesDays = (arr: any[]) => {
  const newItm: Array<{ day: string; total: number }> = [];

  for (let i = 0; i < arr.length; i++) {
    const find = newItm.findIndex((itm) => itm.day == arr[i].createAtDay);
    if (find === -1) {
      const _total = arr[i]?.dishesDescription?.reduce(
        (prev: any, itm: any) => prev + itm.number * itm.price,
        0,
      );
      newItm.push({ day: arr[i].createAtDay, total: _total });
    } else {
      const index = newItm.findIndex((itm) => itm.day === arr[i]?.createAtDay);
      const _subtotal = arr[i]?.dishesDescription?.reduce(
        (prev: any, itm: any) => prev + itm.number * itm.price,
        0,
      );
      const pivot = newItm[index];
      const total = pivot.total + _subtotal;
      newItm[index] = { day: arr[i]?.createAtDay, total };
    }
  }

  return newItm;
};

export const getItemsForHours = (arr: any[]) => {
  const newItm: Array<{ hour: string; total: number }> = [];

  for (let i = 0; i < arr.length; i++) {
    const find = newItm.findIndex((itm) => itm.hour == arr[i].createAtHour);
    if (find === -1) {
      const _total = arr[i]?.dishesDescription?.reduce(
        (prev: any, itm: any) => prev + itm.number * itm.price,
        0,
      );
      newItm.push({ hour: arr[i].createAtHour, total: _total });
    } else {
      const index = newItm.findIndex(
        (itm) => itm.hour === arr[i]?.createAtHour,
      );
      const _subtotal = arr[i]?.dishesDescription?.reduce(
        (prev: any, itm: any) => prev + itm.number * itm.price,
        0,
      );
      const pivot = newItm[index];
      const total = pivot.total + _subtotal;
      newItm[index] = { hour: arr[i]?.createAtHour, total };
    }
  }

  return newItm;
};

export type TDishForSales = {
  dishName: string;
  dishId: string;
  units: number;
  total: number;
  price: number;
};

export const getDishesForSeles = (arr: any[]) => {
  const newItm: Array<TDishForSales> = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].dishesDescription.length; j++) {
      const index = newItm.findIndex(
        (itm) => itm.dishId == arr[i].dishesDescription[j].uuid,
      );
      if (index === -1) {
        const units = parseInt(arr[i].dishesDescription[j].number || "0");
        const _total =
          arr[i].dishesDescription[j].number *
          arr[i].dishesDescription[j].price;
        const _price = arr[i].dishesDescription[j].price;
        const uuid = arr[i].dishesDescription[j].uuid;
        const name = arr[i].dishesDescription[j].name;
        if (units !== 0) {
          newItm.push({
            dishName: name,
            dishId: uuid,
            units,
            total: _total,
            price: _price,
          });
        }
      } else {
        const _total =
          arr[i].dishesDescription[j].number *
          arr[i].dishesDescription[j].price;
        const _price = arr[i].dishesDescription[j].price;
        const pivot = newItm[index];
        const total = pivot.total + _total;
        const units =
          pivot.units + parseInt(arr[i].dishesDescription[j].number || "0");
        const uuid = arr[i].dishesDescription[j].uuid;
        const name = arr[i].dishesDescription[j].name;
        if (units !== 0) {
          newItm[index] = {
            dishName: name,
            dishId: uuid,
            units,
            total: total,
            price: _price,
          };
        }
      }
    }
  }

  return newItm;
};
