import React from "react";
import { NextRouter, useRouter } from "next/router";

const MenuDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);

  return <div>Hola Mundo {id}</div>;
};

export default MenuDetailPage;
