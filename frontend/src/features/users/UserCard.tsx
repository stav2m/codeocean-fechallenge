import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { TruncatedTooltip } from '../../components/TruncatedTooltip'
import type { User } from '../../api/types'

function getInitials(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .map((s) => s?.charAt(0) ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const initials = getInitials(user.firstName, user.lastName)
  const fullName = `${user.firstName} ${user.lastName}`.trim()

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        maxHeight: 148,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderLeftWidth: 4,
        borderLeftColor: 'primary.main',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.light',
        },
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, overflow: 'hidden', '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
            <TruncatedTooltip title={fullName}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                noWrap
              >
                {fullName}
              </Typography>
            </TruncatedTooltip>
          </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.25,
                minWidth: 0,
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <TruncatedTooltip title={user.email}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </Typography>
              </TruncatedTooltip>
            </Box>
            {user.catchPhrase && (
              <TruncatedTooltip title={user.catchPhrase}>
                <Chip
                  label={user.catchPhrase}
                  size="small"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 22,
                    maxWidth: '100%',
                    bgcolor: 'action.hover',
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              </TruncatedTooltip>
            )}
            {user.comments && (
              <TruncatedTooltip title={user.comments} multiLine>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    lineHeight: 1.5,
                    fontSize: '0.8125rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {user.comments}
                </Typography>
              </TruncatedTooltip>
            )}
        </Box>
      </CardContent>
    </Card>
  )
}

