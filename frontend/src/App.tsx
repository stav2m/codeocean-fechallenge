import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { UsersReviewersPanel } from './components/Layout/UsersReviewersPanel'

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        bgcolor: 'background.default',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        overflow: 'hidden',
      }}
    >
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div">
            Code Ocean FE Challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        sx={{
          pt: 3,
          minHeight: 0,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <UsersReviewersPanel />
      </Container>
    </Box>
  )
}

export default App
