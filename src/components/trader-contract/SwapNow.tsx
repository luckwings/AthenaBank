import React, {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    IconButton
  } from "@mui/material";
import { styled } from '@mui/material/styles';


///// Dialog /////
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  
  export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }
  
  const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Box component="img" src="/img/close_ic.svg" />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  
export default function SwapNow() {

    ///// Dialog /////
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  return (
    <>
        <Button className="def_yylw_btn" onClick={handleClickOpen}>Swap Now</Button>
        <div>
            {/* <Button variant="outlined">
                Open dialog
            </Button> */}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                className="swap_dialog"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Your Token Balance
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box className="innr_popup">
                        <Box className="pstn_rltv_bx">
                            <Box>
                                <Typography>Balance</Typography>
                                <Typography component="h6">1250.00 USDT</Typography>
                            </Box>
                            <Box component="img" src="/img/wllt_mny_ic.svg" />
                        </Box>
                        <Typography>Add custom token</Typography>
                        <Box className="inpt_bx def_inpt_btn">
                            <TextField fullWidth id="fullWidth" placeholder='0X...…...0000' />
                            <Button className="def_yylw_btn">Add Token</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </div>
    </>
  )
}
