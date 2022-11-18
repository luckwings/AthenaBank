import { Box, Typography, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import ProjectAPI from "../../helpers/ProjectAPI";
import { ProjectDetailModel } from "../../models/ProjectDetailModel";
import IDOCard from "../IDOCard";

export default function PerformingIdo() {
  const [data, setData] = useState<ProjectDetailModel[]>([]);

  useEffect(() => {
    ProjectAPI.getAll().then((data) => setData(data));
  }, []);

  return (
    <>
      <Box className="idos_main_bx">
        <Typography component="h2" className="def_h2" data-aos="fade-up" data-aos-duration="800">
          Recent Top Performing IDO's
        </Typography>
        <Grid container spacing={4}>
          {data.length === 0 && (
            <Box display="flex" justifyContent="center" width="100%" m={4}>
              <Typography variant="h5" data-aos="fade-up" data-aos-duration="800" className="emptydb" >
                No IDO available at the moment. Subscribe to our newsletter to stay updated about our upcoming IDO.
              </Typography>
            </Box>
          )}
          {data.map((item, index) => (
            <IDOCard key={index} data={item} extraProps={{ "data-aos": "fade-up", "data-aos-duration": "1000" }} />
          ))}
        </Grid>
        {/* <Button className="def_yylw_btn viewmore_btn" data-aos="zoom-in" data-aos-duration="2200">
          View More
        </Button> */}
      </Box>
    </>
  );
}