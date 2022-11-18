import { Box } from "@mui/material";
import React, { useEffect } from "react";

export default function Information() {
  useEffect(() => {
    (window as any).mercuryoWidget.run({
      widgetId: "3be43d68-d0b9-401a-a517-8d9c70ac5470",
      host: document.getElementById("mercuryo-widget"),
    });
    window.scrollTo(0, 0);
  }, []);
  return <Box height={"calc(100vh - 20px)"} id="mercuryo-widget"></Box>;
}
