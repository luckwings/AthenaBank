import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Slider from "react-slick";
export default function NewsAndUpdates() {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1420,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 1110,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [data, setData] = useState<any[]>();
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getData = async () => {
    const response = await axios.get(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@AthenaCryptBank"
    );
    setData(response.data.items);
  };
  return (
    <>
      <Box className="newupdt_main_bx">
        <Typography component="h2" className="def_h2" data-aos="fade-up" data-aos-duration="800">
          News And Updates
        </Typography>
        <Box data-aos="fade-up" data-aos-duration="1000">
          <Slider {...settings}>
            {data?.map(function (value, i) {
              return (
                <div key={i}>
                  <a href={value.link} target="_blank" rel="noreferrer">
                    <Box className="cmmn_bx" style={{ background: "url(" + value.thumbnail + ") no-repeat center 0" }}>
                      <Box className="smthng_nw_bx" style={{ visibility: "hidden" }}>
                        <Typography>Article</Typography>
                      </Box>
                      <Typography component="h5">{value.title}</Typography>
                    </Box>
                  </a>
                </div>
              );
            })}
          </Slider>
        </Box>
      </Box>
    </>
  );
}
