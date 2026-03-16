import { Component, type ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" fontWeight={600} color="error">
              {this.props.fallbackTitle ?? 'Something went wrong'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              {this.state.message}
            </Typography>
            <Button size="small" variant="outlined" onClick={this.handleReset}>
              Try again
            </Button>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}
