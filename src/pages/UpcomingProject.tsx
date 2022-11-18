import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import { ProjectDetailModel } from "../models/ProjectDetailModel";
import ProjectAPI from "../helpers/ProjectAPI";
import IDOCard from "../components/IDOCard";

export default function UpcomingProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [tillIndex, setTillIndex] = useState(15);
  const [data, setData] = useState<ProjectDetailModel[]>([]);
  const currTime = +new Date();
  useEffect(() => {
    setIsLoading(true);
    ProjectAPI.getAll()
      .then((data) => {
        const res = data.filter((project) => +new Date(project.presale.startTime) > currTime);
        return res;
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className="actv_prjct_main_bx idos_main_bx" sx={{ minHeight: `calc(100vh - 48px)` }}>
      <Container>
        <Typography component="h2" className="def_h2">
          Upcoming Projects
        </Typography>
        <Grid container spacing={4}>
          {data
            .filter((_, index) => index < tillIndex)
            .map((item, index) => (
              <IDOCard key={index} data={item} />
            ))}
        </Grid>
        {!isLoading && data.length > tillIndex && (
          <Button className="def_yylw_btn viewmore_btn" onClick={() => setTillIndex((prev) => prev + 3)}>
            View More
          </Button>
        )}
        {!isLoading && data.length === 0 && (
          <Typography component="h4" className="def_h4">
            No Upcoming Projects
          </Typography>
        )}
      </Container>
    </Box>
  );
}
