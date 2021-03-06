import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { mintTicket, balanceOfSSF, approveSSF, getTicketAmount, getTokenURI } from '../../functions/erc/ERCfunctions.js'
import { checkMessage, errorMessage, timerMessage } from '../../functions/alert/alertFunctions.js'
import { useLocation, useNavigate } from 'react-router-dom'

import useBrightness from '../../hooks/useBrightness.js'
import { getRequest, postRequest, putRequest } from '../../api/requests.js'
import { BASE_URL } from '../../api/requests.js'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
}

export default function MintConcertPaymentModal({ open, handleClose, concertInfo }) {
  const userAddress = sessionStorage.getItem('address')
  const contractAddress = concertInfo.contractAddress
  const navigate = useNavigate()
  const seatId = useLocation().state.seat.id

  const [bright, _] = useBrightness()
  const [wallet, setWellet] = useState(0)
  const [userWalletPK, setUserWalletPK] = useState('')

  const pushMypage = () => navigate('/mypage')

  const checkWalletBalance = async () => {
    const response = await balanceOfSSF(userAddress)
    setWellet(response)
  }
  const makeTokenURI = async () => {
    const max = concertInfo.cids.length
    const random = Math.floor(Math.random() * max)
    const images = JSON.parse(concertInfo.cids[random].cid)
    const data = {
      contractId: concertInfo.id,
      title: concertInfo.title,
      place: concertInfo.place,
      date: concertInfo.date,
      time: concertInfo.time,
      area: concertInfo.area,
      seat: JSON.stringify(concertInfo.seat),
      price: concertInfo.price,
      artists: JSON.stringify(concertInfo.artists),
      img: JSON.stringify({
        gif: `${BASE_URL}${images.gif}`,
        mp4: `${BASE_URL}${images.mp4}`,
      }),
    }

    const response = await postRequest('api/ticket/uriData', data)

    return String(response.data)
  }

  const paying = async () => {
    const amount = await getTicketAmount(contractAddress, userAddress)
    if (amount > 0) {
      errorMessage(
        '?????? ???????????? ?????? ??????????????????',
        null,
        () => {
          handleClose()
          pushMypage()
        },
        bright,
      )
      return
    }
    const seatState = await getRequest(`api/ticket/seat/${seatId}`)
    if (seatState.data.status !== 0) {
      errorMessage('????????? ????????? ??? ????????????', '?????? ????????? ???????????????', () => navigate(-1), bright)
      return
    }
    await approveSSF(userWalletPK, contractAddress, concertInfo.price)
    const tokenURI = await makeTokenURI()

    // ?????? ??????
    const result = await mintTicket(contractAddress, userAddress, userWalletPK, tokenURI)
    if (result) {
      checkMessage('????????? ?????????????????????', pushMypage, bright)
      putRequest('api/ticket', { seatId: seatId })
      return
    } else {
      errorMessage('????????? ????????? ??? ????????????', null, pushMypage, bright)
      return
    }
  }

  const minting = () => {
    timerMessage('?????? ????????? ?????????', '????????? ???????????? ????????????', paying, bright)
  }

  useEffect(() => {
    checkWalletBalance()
  })
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description">
      <Box sx={{ ...style, minWidth: '340px', maxWidth: '414px', zIndex: '-1' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          ????????? ???????????????.
        </Typography>
        <Grid container sx={{ margin: '40px 0 30px' }}>
          <Grid item xs={5.5} sx={itemStyle}>
            <Typography sx={itemTypo}>?????? ??????</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>{wallet} SSF</Typography>
          </Grid>
          <Grid item xs={1} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '12px', lineHeight: '44px' }}>???</Typography>
          </Grid>
          <Grid item xs={5.5} sx={itemStyle}>
            <Typography sx={itemTypo}>?????? ??? ?????? ??????</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>{wallet - concertInfo.price} SSF</Typography>
          </Grid>
        </Grid>
        <TextField
          size="small"
          label="???????????? ??????????????????."
          placeholder="0xabcd1234abcd1234abcd1234abcd1234abcd1234"
          value={userWalletPK}
          onChange={e => setUserWalletPK(e.target.value)}
          sx={{ width: '100%', margin: '16px 0' }}></TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: '600' }}>Total</Typography>
          <Typography>{concertInfo.price} SSF</Typography>
        </Box>
        <Box sx={{ marginTop: '16px', float: 'right' }}>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            ??????
          </Button>
          <Button variant="contained" sx={{ marginLeft: '10px' }} onClick={minting}>
            ??????
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

const itemStyle = { display: 'flex', flexDirection: 'column', textAlign: 'center' }
const itemTypo = { fontSize: '12px', color: '#C4C4C4' }
