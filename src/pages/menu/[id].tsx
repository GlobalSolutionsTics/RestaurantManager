import React from "react";
import { useRouter } from "next/router";

const MenuDetailPage = () => {
  const router = useRouter();
  const { id, value, price } = router.query;
  console.log(router.query);
  console.log(router);

  return (
    <div>
      <div>Hola Mundo {id}</div>
      <div>{}</div>
    </div>
  );
};

export default MenuDetailPage;
