import React, { useState, useEffect } from 'react';
import './assets/css/App.scss';
import AppBar from '@mui/material/AppBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import SideBar from './layout/SideBar';
import Header from './layout/Header';
import Dashboard from './pages/Dashboard';
import Information from './pages/Information';
import Footer from './layout/Footer';
import PeriodDetail from './pages/PeriodDetail';
import AthenaLevel from './pages/AthenaLevel';
import DyorAreaDetail from './pages/DyorAreaDetail';
import Staking from './pages/Staking';
import ContractDetails from './pages/ContractDetails';
import TraderContracts from './pages/TraderContracts';
import PastProject from './pages/PastProject';
import ActiveProject from './pages/ActiveProject';
import UpcomingTraderLocks from './pages/UpcomingTraderLocks';
import ActiveTraderLock from './pages/ActiveTraderLock';
import OpenTraderLock from './pages/OpenTraderLock';
import PastTraderLock from './pages/PastTraderLock';
import TradersList from './pages/TradersList';
import Loader from './components/Loader';
import { useAddress, useWeb3Context } from './hooks';
import UpcomingProject from './pages/UpcomingProject';
import { getTokenData } from './helpers/token-data';
import TextPage from './pages/TextPage';
import TeamPage from './pages/TeamPage';
import TraderLockHistory from './pages/TraderLockHistory';
import TermsConditions from './pages/TermsConditions';
import Referral from './pages/Referral';
const drawerWidth = 320;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  windowt?: () => Window;
}

function App(props: Props) {
  const { windowt } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { connect, provider, hasCachedProvider, chainID, connected } =
    useWeb3Context();
  const address = useAddress();
  const [tokenData, setTokenData] = useState<any>();

  useEffect(() => {
    if (hasCachedProvider()) {
      connect();
    }
    getTokenData().then(res => { setTokenData(res) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50);
    });
  }, []);
  const drawer = (
    <div className='main_flx'>
      {/* <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
      <SideBar />
    </div>
  );

  const container =
    windowt !== undefined ? () => windowt().document.body : undefined;

  return (
    <BrowserRouter>
      <Loader />
      <div className='App'>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            className={scroll ? 'as_header bgdrk' : 'as_header'}
            position='fixed'
            sx={{
              width: { lg: `calc(100% - ${drawerWidth}px)` },
              ml: { lg: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { lg: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Header tokenData={tokenData} />
            </Toolbar>
          </AppBar>
          <Box
            component='nav'
            sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
            aria-label='mailbox folders'
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              container={container}
              variant='temporary'
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', lg: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
              className='as_drwr'
            >
              {drawer}
            </Drawer>
            <Drawer
              className='as_drwr'
              variant='permanent'
              sx={{
                display: { xs: 'none', lg: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component='main'
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
            className='main_page'
          >
            {/* <Toolbar /> */}
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/information' element={<Information />} />
              <Route path='/perioddetail' element={<PeriodDetail />} />
              <Route path='/dyorareadetail' element={<DyorAreaDetail />} />
              <Route path='/athenalevel' element={<AthenaLevel />} />
              <Route path='/contractdetail' element={<ContractDetails />} />
              <Route path='/staking' element={<Staking />} />
              <Route path='/tradercontract' element={<TraderContracts />} />
              <Route path='/pastproject' element={<PastProject />} />
              <Route path='/activeproject' element={<ActiveProject />} />
              <Route path='/upcomingproject' element={<UpcomingProject />} />
              <Route path='/upcomingtraderlock' element={<UpcomingTraderLocks />} />
              <Route path='/activetraderlock' element={<ActiveTraderLock />} />
              <Route path='/traderlockhistory/:useraddress' element={<TraderLockHistory />} />
              <Route path='/opentraderlock' element={<OpenTraderLock />} />
              <Route path='/pasttraderlock' element={<PastTraderLock />} />
              <Route path='/traderslist' element={<TradersList />} />
              <Route path='/text-page' element={<TextPage />} />
              <Route path='/team' element={<TeamPage />} />
              <Route path='/terms-and-conditions' element={<TermsConditions />} />
              <Route path='/referral' element={<Referral />} />
            </Routes>
            <Footer tokenData={tokenData} />
          </Box>
        </Box>
      </div>
    </BrowserRouter>
  );
}

export default App;
