import React from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'


export default function TeamPage() {
  return (
    <>
        <Box className='text_pages_two'>
            <Box className='over_team'>
                <Typography component='h1'>Athena Bank Team</Typography>
            </Box>
            <Container className='team'>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/tenentes.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Alessandro Tenentes</Typography>
                                <Typography>CEO Chief Executive Officer</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/ippoliti.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Tiziano Ippoliti</Typography>
                                <Typography>CCO Chief Communications Officer</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/rossi.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Matteo Rossi</Typography>
                                <Typography>CMO Chief Marketing Officer</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/cicerchia.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Simone Cicerchia</Typography>
                                <Typography>CLO Chief Legal Officer</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/castagnone.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Lorenzo Castagnone</Typography>
                                <Typography>CTO Chief Technology Officer</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/morosan.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Daniel Morosan</Typography>
                                <Typography>Partnership & Community Director</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/georgiev.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Georgi Georgiev</Typography>
                                <Typography>Developer Bot Trading System</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/eupili.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Simone Eupili </Typography>
                                <Typography>Blockchain and DeFi Analyst</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className='grd_box'>
                            <Box component="img" src="/img/team/cementina.jpg" />
                            <Box className='grd_heding_box'>
                                <Typography component='h1'>Patrick Jorrel Cementina</Typography>
                                <Typography>Blockchain and DeFi Analyst</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    </>
  )
}
