import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import TradingProtocol from '../components/dashboard/TradingProtocol';
import ExclsvFtrs from '../components/dashboard/ExclsvFtrs';
import PerformingIdo from '../components/dashboard/PerformingIdo';
import TraderLocks from '../components/dashboard/TraderLocks';
import Traders from '../components/dashboard/Traders';
import NewsAndUpdates from '../components/dashboard/NewsAndUpdates';
import Subscribe from '../components/dashboard/Subscribe';
import Faq from '../components/dashboard/Faq';
import AOS from 'aos';
import { ethers } from 'ethers';
import { TraderContract, IDOContract, ERC20Contract } from '../abi';
import { getAddresses } from '../constants';
import { convertWei } from '../helpers/convert-wei';
import ProjectAPI from '../helpers/ProjectAPI';
import TraderLockAPI from '../helpers/TraderLockAPI';
import UserAPI from '../helpers/userAPI';
import { useWeb3Context } from '../hooks';
import { getTokenData } from '../helpers/token-data';
import { useCookies } from 'react-cookie';

export default function Dashboard() {
  AOS.init({
    offset: -500,
  });
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [totalCount, setTotalCount] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [liquidityLocked, setLiquidityLocked] = useState(0);
  const { address, provider, chainID } = useWeb3Context();

  const getData = useCallback(async () => {
    const traderlocks = await TraderLockAPI.getAll();
    const idoList = await ProjectAPI.getAll();
    const projectCount = traderlocks.length + idoList.length;
    setTotalCount(projectCount);
    let liquidity = 0
    for (const row of traderlocks) {
      const contract = new ethers.Contract(row.contract, TraderContract, provider);
      const cap = convertWei(await contract.totalInvestment());
      const tokenData = await getTokenData(row.tokenId)
      liquidity = liquidity + (cap*tokenData.price);
    }
    for (const row of idoList) {
      const contract = new ethers.Contract(row.contractAddress, IDOContract, provider);
      const cap = convertWei(await contract.totalAmount());
      const tokenData = await getTokenData(row.tokenId)
      liquidity = liquidity + (cap*tokenData.price);
    }
    setLiquidity(+liquidity.toFixed(0));
    const users = await UserAPI.getCount();
    setUserCount(users);
    const contract = new ethers.Contract(getAddresses(chainID).ATHENA, ERC20Contract, provider);
    const lpLvlBal = await contract.balanceOf(getAddresses(chainID).LP_LEVEL_ADDRESS);
    setLiquidityLocked(convertWei(lpLvlBal));
  }, [chainID, provider]);

  const saveRef =  () => {
    const ref = searchParams.get('ref');
    if (ref) {
      if (!cookies['ref']) {
        let expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);

        setCookie('ref', ref, { path: '/', expires: expireDate });
      }
    }
  };

  useEffect(() => {
    getData();
    saveRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Box className="dsbrd_main_bx">
        <Container>
          <TradingProtocol totalCount={totalCount} liquidity={liquidity} userCount={userCount} liquidityLocked={liquidityLocked}/>
          <ExclsvFtrs />
          <PerformingIdo />
          <TraderLocks />
          <Traders />
          <NewsAndUpdates />
          <Subscribe />
          <Faq />
        </Container>
      </Box>
    </>
  )
}
