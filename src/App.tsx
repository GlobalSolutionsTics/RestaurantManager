import React, { useState } from "react";
import Dishes from "./components/dishes/Dishes";

const App = () => {
  const [order, setOrder] = useState<string>("");
  return (
    <div>
      <Dishes
        title=''
        description=''
        content=''
        order={order}
        setOrder={setOrder}
      />
    </div>
  );
};

export default App;
