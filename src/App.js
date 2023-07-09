import * as React from 'react'
import Mui from './Mui'

import imgBackground3 from './assets/background-3.png'
import './App.css'
import { ThemeProvider } from '@emotion/react'
import axios from 'axios'
import Icons from './Icons'

const Background = Mui.styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: `url(${imgBackground3})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2000,
})

let theme = Mui.createTheme()

function App() {
  let [alertOpen, setAlertOpen] = React.useState(false)
  let [alertDetail, setAlertDetail] = React.useState({ "type": "error", "title": "", "message": "" })

  let [dialogState, setDialogState] = React.useState(true)
  let [confirmDialogState, setConfirmDialogState] = React.useState(false)
  let [serverUrl, setServerUrl] = React.useState('')
  let [queryServerInfo, setQueryServerInfo] = React.useState({
    'coreBuildNumber': 0,
    'coreCodeName': '',
    'serverTime': '',
    'xmsProjectAuthor': '',
    'instanceName': '',
    'instanceDescription': ''
  })

  let handleDialogClose = () => {
    window.close()
  }

  let handleBtnConfirmClicked = () => {
    window.location = `${serverUrl}`
  }

  let handleBtnConnectClicked = () => {
    if (serverUrl.endsWith("/")) { serverUrl = serverUrl.substring(0, serverUrl.length - 1) }
    axios.get(`${serverUrl}/api/xms/v1/info`).then((data) => {
      setDialogState(false)
      setConfirmDialogState(true)
      setQueryServerInfo(data.data)
    }).catch((err) => {
      setAlertDetail({ "type": "error", "title": "Error", "message": `Error connecting to server: NetworkError` })
      setAlertOpen(true)
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Background />
      <Mui.Snackbar open={alertOpen} autoHideDuration={6000} >
        <Mui.Alert severity={alertDetail.type} action={
          <Mui.IconButton color="inherit" size="small" onClick={() => { setAlertOpen(false) }} >
            <Icons.Close fontSize="inherit" />
          </Mui.IconButton>
        }>
          <Mui.AlertTitle>{alertDetail.title}</Mui.AlertTitle>
          {alertDetail.message}
        </Mui.Alert>
      </Mui.Snackbar>
      <Mui.Dialog onClose={() => { handleDialogClose() }} open={dialogState} >
        <Mui.DialogTitle>Connect to</Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Typography variant='body2'>
            Enter the URL of XmediaCenter instance:
            <Mui.TextField variant='filled' fullWidth label='URL' margin='normal' filled value={serverUrl} onChange={(event) => { setServerUrl(event.currentTarget.value) }} placeholder='http://192.168.1.3:3000/' />
          </Mui.Typography>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={() => { handleBtnConnectClicked() }}>Connect</Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>

      <Mui.Dialog onClose={() => { setConfirmDialogState(false); setDialogState(true) }} open={confirmDialogState} >
        <Mui.DialogTitle>Confirm</Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Typography component="div" variant='body2'>
            Are you sure to connect to {queryServerInfo.instanceName} (URL: {serverUrl}) ?
            <br />
            <br />
            <span style={{fontWeight: "bold"}}>Instance description</span>: {queryServerInfo.instanceDescription}<br />
            <span style={{fontWeight: "bold"}}>Instance server time</span>: {queryServerInfo.serverTime}<br />
            <span style={{fontWeight: "bold"}}>Instance XMS version</span>: codename={queryServerInfo.coreCodeName}; buildNumber={queryServerInfo.coreBuildNumber}<br />
          </Mui.Typography>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={() => { setConfirmDialogState(false); setDialogState(true) }}>Cancel</Mui.Button>
          <Mui.Button onClick={() => { handleBtnConfirmClicked() }}>Confirm</Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>
    </ThemeProvider>
  );
}

export default App;
