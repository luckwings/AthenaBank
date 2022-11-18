import { Typography } from "@mui/material";
import { Fragment } from "react";

class LevelFeeReductionProps {
  levelFeeReduction: number[];
  currentLvl: number;
}

export default function LevelFeeReduction(data: LevelFeeReductionProps) {
  return (
    <Typography component="h6">
      {data.levelFeeReduction.map((fee, index) => {
        let separator = index === data.levelFeeReduction.length - 1 ? null : " | ";
        const value = `Level ${index}: ${fee}%`;
        let el = index === data.currentLvl ? <span>{value}</span> : value;
        return (
          <Fragment key={index}>
            {el}
            {separator}
          </Fragment>
        );
      })}
    </Typography>
  );
}
