import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { useState } from 'react'
import { UsersList } from '../../features/users/UsersList'
import { ReviewersList } from '../../features/reviewers/ReviewersList'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  const isActive = value === index

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`users-reviewers-tabpanel-${index}`}
      aria-labelledby={`users-reviewers-tab-${index}`}
      style={{
        ...(isActive
          ? {
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }
          : undefined),
      }}
      {...other}
    >
      {isActive && (
        <Box
          sx={{
            pt: 2,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `users-reviewers-tab-${index}`,
    'aria-controls': `users-reviewers-tabpanel-${index}`,
  }
}

export function UsersReviewersPanel() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [tab, setTab] = useState(0)

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  if (isDesktop) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
        }}
      >
        <Box sx={{ minWidth: 0, minHeight: 0 }}>
          <UsersList />
        </Box>
        <Box sx={{ minWidth: 0, minHeight: 0 }}>
          <ReviewersList />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs
        value={tab}
        onChange={handleChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ flexShrink: 0 }}
      >
        <Tab label="Users" {...a11yProps(0)} />
        <Tab label="Reviewers" {...a11yProps(1)} />
      </Tabs>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TabPanel value={tab} index={0}>
          <UsersList />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ReviewersList />
        </TabPanel>
      </Box>
    </Box>
  )
}

