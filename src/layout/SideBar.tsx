import React from 'react';
import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
  } from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLocation } from 'react-router-dom';

export default function SideBar() {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    const [opentwo, setOpenTwo] = React.useState(false);
    const handleClickTwo = () => {
        setOpenTwo(!opentwo);
    };

    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split('/');
  return (
    <>
        <Box className="as_sidebar">
            <Link to="/" className="sdbr_logo">
                <Box component="img" src="/img/logo.svg" />
            </Link>
            <Box className="clps_box">
                <ListItemButton>
                    <Link to="/" className={splitLocation[1] === '' ? 'active' : ''}>
                        <ListItemIcon>
                            <Box component="img" src="/img/home_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <Link to="/">
                        <ListItemIcon>
                            <Box component="img" src="/img/gov_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="Governance" />
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <Link to="/information" className={splitLocation[1] === 'information' ? 'active' : ''}>
                        <ListItemIcon>
                            <Box component="img" src="/img/info_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="Buy Crypto" />
                    </Link>
                </ListItemButton>
                <Box className={open ? "fr_list show" : "fr_list"}>
                    <ListItemButton onClick={handleClick} className="menu_cllps">
                    <ListItemIcon>
                        <Box component="img" src="/img/project_ic.svg" />
                    </ListItemIcon>
                    <ListItemText primary="Projects" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Box className="inside_links">
                        <Link to="/upcomingproject" className={splitLocation[1] === 'upcomingproject' ? 'active' : ''}>Upcoming Projects</Link>
                        <Link to="/activeproject" className={splitLocation[1] === 'activeproject' ? 'active' : ''}>Active Projects</Link>
                        <Link to="/pastproject" className={splitLocation[1] === 'pastproject' ? 'active' : ''}>Past Projects</Link>
                        </Box>
                    </List>
                    </Collapse>
                </Box>
                <Box className={opentwo ? "fr_list show" : "fr_list"}>
                    <ListItemButton onClick={handleClickTwo} className="menu_cllps">
                    <ListItemIcon>
                        <Box component="img" src="/img/lock_ic.svg" />
                    </ListItemIcon>
                    <ListItemText primary="Trading Contracts" />
                    {opentwo ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={opentwo} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Box className="inside_links">
                            <Link to="/upcomingtraderlock" className={splitLocation[1] === 'upcomingtraderlock' ? 'active' : ''}>Upcoming Trading Contracts</Link>
                            <Link to="/opentraderlock" className={splitLocation[1] === 'opentraderlock' ? 'active' : ''}>Open Trading Contracts</Link>
                            <Link to="/activetraderlock" className={splitLocation[1] === 'activetraderlock' ? 'active' : ''}>Active Trading Contracts</Link>
                            <Link to="/pasttraderlock" className={splitLocation[1] === 'pasttraderlock' ? 'active' : ''}>Past Trading Contracts</Link>
                            <Link to="/traderslist" className={splitLocation[1] === 'traderslist' ? 'active' : ''}>Traders List</Link>
                            <Link to="/tradercontract" className={splitLocation[1] === 'tradercontract' ? 'active' : ''}>Trading Dashboard</Link>
                        </Box>
                    </List>
                    </Collapse>
                </Box>
                <ListItemButton>
                    <Link to="/">
                        <ListItemIcon>
                            <Box component="img" src="/img/trndgbts_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="Trading Bots" />
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <Link to="/athenalevel" className={splitLocation[1] === 'athenalevel' ? 'active' : ''}>
                        <ListItemIcon>
                            <Box component="img" src="/img/level_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="ATH Level" />
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <Link to="/staking" className={splitLocation[1] === 'staking' ? 'active' : ''}>
                        <ListItemIcon>
                            <Box component="img" src="/img/stkng_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="ATH Staking" />
                    </Link>
                </ListItemButton>
                <ListItemButton>
                    <a href="http://forum.athenacryptobank.io/" target="_blank" rel='noreferrer'> 
                        <ListItemIcon>
                            <Box component="img" src="/img/forum_ic.svg" />
                        </ListItemIcon>
                        <ListItemText primary="Athena Forum" />
                    </a>
                </ListItemButton>
            </Box>
            
        </Box>
        <Box className='flex_grow' />
        <Box className="sdbr_cprgt">
            <Typography>© All rights reserved by AthenaCryptoBank</Typography>
        </Box>
    </>
  )
}
