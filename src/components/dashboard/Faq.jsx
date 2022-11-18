import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";

export default function Faq() {
  return (
    <>
      <Box className="faq_main_bx">
        <Typography component="h2" className="def_h2">Frequently Asked Questions</Typography>
        <Box className="accrdng_bx">
          <Accordion className="faq_acrdng">
            <AccordionSummary
              expandIcon={
                <Box className="plus_mines_prnt_bx">
                    <Box component='img' className="plus_acrdng_img" src='/img/plus_ic.svg' />
                    <Box component='img' className="mines_acrdng_img" src='/img/minus_ic.svg' />
                </Box>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>What is Athena Crypto Bank?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              Athena crypto bank is a company that focuses on providing easily accessible digital investment opportunities even for investors with small capital and basic technical knowledge.
              With the athena crypto bank DeFi platform, it will be possible to participate in presales of other projects selected by the team.
              This allows the investor to enter exclusive projects with the Crowdfunding mode and execute copytrading in DeFi allowing professional traders to manage the chosen capital through a Smart Contract.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="faq_acrdng">
            <AccordionSummary
              expandIcon={
                <Box className="plus_mines_prnt_bx">
                    <Box component='img' className="plus_acrdng_img" src='/img/plus_ic.svg' />
                    <Box component='img' className="mines_acrdng_img" src='/img/minus_ic.svg' />
                </Box>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>What is ATH token and where can I buy?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              ATH is a token of the project, which can be used for reducing trading fees, priority access to presales, participation in governance and to receive access to various exclusive services. For the moment you can buy the ATH token on coinsbit.io, we have already thought about launching the token also on pancakeswap. stay tuned to our social channels              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="faq_acrdng">
            <AccordionSummary
              expandIcon={
                <Box className="plus_mines_prnt_bx">
                    <Box component='img' className="plus_acrdng_img" src='/img/plus_ic.svg' />
                    <Box component='img' className="mines_acrdng_img" src='/img/minus_ic.svg' />
                </Box>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>I invested in Athena Crypto Bank investment fund, is there any chance that I can lose my investment?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              There is no risk-free investment: whoever promises that to you, is probably a scammer, otherwise an insider would be charging you a large fee in order to secure his own profit. What we can promise you is that we evaluate with great attention all the projects we invest in, as we ourselves are the first to invest our money in the proposed projects. We don't go into projects where the business plan or team in charge is unclear, and we don't invest in any pyramidal scheme. The investment fund is not always available and selectable on the website, as in case we do not have an opportunity with very little risk and at a good price we prefer not to invest and wait for better projects. This modus operandi has, until now, allowed us to have significant results with minimal risks.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="faq_acrdng">
            <AccordionSummary
              expandIcon={
                <Box className="plus_mines_prnt_bx">
                    <Box component='img' className="plus_acrdng_img" src='/img/plus_ic.svg' />
                    <Box component='img' className="mines_acrdng_img" src='/img/minus_ic.svg' />
                </Box>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>What is the difference between projects and trading contracts?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              In Athena platform you can invest in projects early before they go out on the crypto market exchanges, a sort of crowfunding for projects that have yet to be traded publicly. These tokens are usually sold at the lowest price and during the launch of the project they begin to gain value. Offered: seed sale, private sale or presale.
              While trading contracts is where you can invest in crypto projects by copying an experienced trader of Athena platform using a smart contract. You don't need to be an experienced trader to use this feature, because it will simply copy the trades of your chosen trader from the platform. All of the traders performance is recorded and can be viewed by everyone.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="faq_acrdng">
            <AccordionSummary
              expandIcon={
                <Box className="plus_mines_prnt_bx">
                    <Box component='img' className="plus_acrdng_img" src='/img/plus_ic.svg' />
                    <Box component='img' className="mines_acrdng_img" src='/img/minus_ic.svg' />
                </Box>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>How are the fees of the Athena Crytpo Bank investment fund calculated?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              Commissions are calculated with a fixed percentage of the invested capital on entry into the projects in a presale or private sale.
              In trading contracts, on the other hand, commissions are calculated only on the profit generated and not on the capital.
              In both cases, you can block your ATH tokens in the platform to have a higher level and pay fewer commission fees on all investment opportunities. To get level 0 and participate in investments you don't have to block any ATH tokens. For levels 1-2-3, you have to block 5000 ATH, 25000 ATH and 50000 ATH respectively. The tokens are blocked for 6 months and upon withdrawal will be charged a fee that varies over time depending on the historical period and its opportunities, Athena will start at launch with 1% fee and then increase with time. The change of fees is not retroactive so even if the fees increase but you had already locked it in at a lower fee you will always have the same level until the end of the 6 months. The fees calculated are for level 0: 40%, for level 1: 30%, for level 2: 25% and for level 3: 20%.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="faq_acrdng">
            <AccordionSummary
              expandIcon={
                <Box className="plus_mines_prnt_bx">
                    <Box component='img' className="plus_acrdng_img" src='/img/plus_ic.svg' />
                    <Box component='img' className="mines_acrdng_img" src='/img/minus_ic.svg' />
                </Box>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Is KYC required to be able to participate in Athena Investments?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              No KYC check is required on the Athena Crypto Bank website, neither the moment you sign up nor later during your investing activity. the platform is managed by a smart contract which does not allow us to intervene in users' funds even at the request of the authorities. The only thing we can do and put you on our blacklist.              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </>
  )
}
