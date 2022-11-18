import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import IDOCard from "../components/IDOCard";
import ProjectAPI from "../helpers/ProjectAPI";
import { ProjectDetailModel } from "../models/ProjectDetailModel";

export default function PastProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [tillIndex, setTillIndex] = useState(15);
  const [data, setData] = useState<ProjectDetailModel[]>([]);
  const currTime = +new Date();
  useEffect(() => {
    setIsLoading(true);
    ProjectAPI.getAll()
      .then((data: any) => {
        const res = data.filter(
          (project) => +new Date(project.presale.startTime) < currTime && +new Date(project.presale.endTime) < currTime
        );
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
    <>
      <Box className="past_prjct_main_bx idos_main_bx" sx={{ minHeight: `calc(100vh - 48px)` }}>
        <Container>
          <Typography component="h2" className="def_h2">
            Past Projects
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
              No Past Projects
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
}
