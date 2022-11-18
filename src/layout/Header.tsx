import React, { useRef } from 'react';
import { Box, Button, FormControl, MenuItem, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ConnectMenu from '../components/connect-button';
import AthenaSkeleton from '../components/AthenaSkeleton';

export default function Header({ tokenData }) {
  const [age, setAge] = React.useState('');
  const menuRef = useRef();

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  const [bsc, setbsc] = React.useState('');

  const handleChangeTwo = (event: SelectChangeEvent) => {
    setbsc(event.target.value);
  };

  let menuPos = {
    left: 1400,
    top: 74,
  };
  if (menuRef.current) {
    const rect = (menuRef.current as HTMLElement).getBoundingClientRect();
    menuPos = {
      left: rect.left,
      top: rect.bottom + 8,
    };
  }

  return (
    <>
      <Box className='insd_hdr'>
        <Box className='lft_cntnt'>
          <Button className='def_blue_btn ntfctn_btn'>
            <Box component='img' src='/img/notification_ic.svg' />
          </Button>
          <Box className='def_slct'>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={age}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value=''>
                  <em>
                    <Box component='img' src='/img/usa_ic.png' />
                    EN
                  </em>
                </MenuItem>
                {/* <MenuItem value={10}>
                  <Box component='img' src='/img/usa_ic.png' />
                  ITA
                </MenuItem> */}
              </Select>
            </FormControl>
          </Box>
          <Box className='price_bx'>
            {tokenData ? (
              <Typography component='h3'>
                {/* <Box component='img' src='/img/athena.png' /> <span>${tokenData?.price}</span> */}
                <Box component='img' src='/img/athena.png' /> <span>0.15$</span>
              </Typography>
            ) : (
              <AthenaSkeleton variant="rectangular" height={28} width={80} />
            )}
          </Box>
        </Box>
        <Box className='rght_cntnt'>
          {/* <Button className="plus_btn">
                    <Box component="img" src="/img/plus_circle_ic.svg" />
                </Button> */}
          <Box className='def_slct'>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={bsc}
                onChange={handleChangeTwo}
                ref={menuRef}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  sx: {
                    "& .MuiPopover-paper": {
                      left: `${menuPos.left}px !important`,
                      top: `${menuPos.top}px !important`
                    }
                  }
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value=''>
                  <em>
                    <Box component='img' src='/img/bsc_ic.svg' />
                    BSC
                  </em>
                </MenuItem>
                {/* <MenuItem value={10}>
                  <Box component='img' src='/img/bsc_ic.svg' />
                  ETH
                </MenuItem> */}
              </Select>
            </FormControl>
          </Box>
          <ConnectMenu />
          {/* <Link to="/contractdetail" className="cnct_wllt_btn def_yylw_btn">
                    <Box component="img" src="/img/wllt_ic.svg" />
                    Connect Wallet
                </Link> */}
        </Box>
      </Box>
    </>
  );
}
