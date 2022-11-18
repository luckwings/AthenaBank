import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  FormControl,
} from "@mui/material";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { useWeb3Context } from "../../hooks";
import { getAddresses } from "../../constants";
import { ethers } from "ethers";
import { ATHLevelContract } from "../../abi";
import UserAPI from "../../helpers/userAPI";

export default function Subscribe() {
  // const ariaLabel = { 'aria-label': 'description' };

  const url =
    "https://athenacryptobank.us13.list-manage.com/subscribe/post?u=a5583fc27dd64568c4d79e34a&amp;id=d6fd56d62f";

  return (
    <>
      <Box className="sbscrb_main_bx">
        <Typography component="h2" className="def_h2">
          Don't miss any change to participate, join the newsletter!
        </Typography>
        <Typography>
          Subscribe now to our newsletter so you won’t miss out for the updates, giveaways and exciting developments in
          the future.
        </Typography>
        <MailchimpSubscribe
          url={url}
          render={({ subscribe, status, message }) => (
            <>
              <CustomForm status={status} message={message} onValidated={(formData) => subscribe(formData)} />
            </>
          )}
        />
      </Box>
    </>
  );
}

const CustomForm = ({ status, message, onValidated }) => {
  const [email, setEmail] = useState("");
  const { address, chainID, provider } = useWeb3Context();
  const [emailValid, setEmailValid] = useState(false);
  const addresses = getAddresses(chainID);
  const athContract = new ethers.Contract(addresses.LP_LEVEL_ADDRESS, ATHLevelContract, provider);
  const emailUpdated = (value: string) => {
    setEmail(value);
    var regex = /\S+@\S+\.\S+/;
    let isValid = regex.test(email);
    setEmailValid(isValid);
  };
  const submit = async () => {
    let params = { EMAIL: email };
    if (address && address !== "") {
      params["WALLET"] = address;
      const level = await athContract.athLevel(address);
      params["ALEVEL"] = Number(level);
      let user = await UserAPI.get(address);
      if (user && user.firstName && user.firstName !== "") {
        params["FNAME"] = user.firstName;
      }
    }

    email && email.indexOf("@") > -1 && onValidated(params);
  };
  return (
    <Box maxWidth={760} width="100%">
      <FormControl fullWidth>
        <OutlinedInput
          type="email"
          fullWidth
          placeholder="Enter your email"
          value={email}
          onChange={(e) => emailUpdated(e.target.value)}
          error={status === "error"}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 24,
            color: "white",
            pr: 1,
            pt: 0.1,
            pl: 1.5,
          }}
          endAdornment={
            <InputAdornment position="end">
              <Button
                className="def_yylw_btn"
                style={{ paddingLeft: 16, paddingRight: 16, margin: 0 }}
                onClick={() => submit()}
                disabled={!emailValid}
              >
                Subscribe Now
              </Button>
            </InputAdornment>
          }
        />
        {status === "error" && <FormHelperText className="red_txt">{message}</FormHelperText>}
        {status === "sending" && <FormHelperText>Sending...</FormHelperText>}
        {status === "success" && <FormHelperText style={{ color: "#30d158" }}>Subscribed!</FormHelperText>}
      </FormControl>
    </Box>
  );
};
