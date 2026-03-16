import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { useState } from 'react'
import { PersonList } from '../../features/persons/PersonList'
import { ErrorBoundary } from '../ErrorBoundary'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  const isActive = value === index
  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      id={`users-reviewers-tabpanel-${index}`}
      aria-labelledby={`users-reviewers-tab-${index}`}
      style={isActive ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : undefined}
    >
      {isActive && (
        <Box sx={{ pt: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
      <Box sx={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <Box sx={{ minWidth: 0, minHeight: 0 }}>
          <ErrorBoundary fallbackTitle="Users list unavailable">
            <PersonList title="Users" endpoint="/users" />
          </ErrorBoundary>
        </Box>
        <Box sx={{ minWidth: 0, minHeight: 0 }}>
          <ErrorBoundary fallbackTitle="Reviewers list unavailable">
            <PersonList title="Reviewers" endpoint="/reviewers" />
          </ErrorBoundary>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <TabPanel value={tab} index={0}>
          <ErrorBoundary fallbackTitle="Users list unavailable">
            <PersonList title="Users" endpoint="/users" />
          </ErrorBoundary>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ErrorBoundary fallbackTitle="Reviewers list unavailable">
            <PersonList title="Reviewers" endpoint="/reviewers" />
          </ErrorBoundary>
        </TabPanel>
      </Box>
    </Box>
  )
}
