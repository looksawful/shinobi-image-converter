import { createTheme, alpha } from '@mui/material'

const g = v => `#${v}`
const grey = {
  0: g('FFFFFF'), 4: g('F8F8F8'), 10: g('F3F3F3'), 20: g('E7E7E7'),
  30: g('D0D0D0'), 40: g('B9B9B9'), 50: g('9E9E9E'), 60: g('7A7A7A'),
  70: g('5C5C5C'), 80: g('3D3D3D'), 90: g('1F1F1F'), 100: g('000000')
}
const outline = m => alpha(m === 'light' ? grey[90] : grey[0], .12)
const shadow = o => `0 0 12px ${o}`

export default mode => createTheme({
  spacing: f => `${f * 8}px`,
  palette: {
    mode,
    primary: { main: grey[60] },
    secondary: { main: grey[40] },
    background: { default: mode === 'light' ? grey[4] : grey[90], paper: mode === 'light' ? grey[0] : grey[80] },
    divider: outline(mode),
    text: { primary: mode === 'light' ? grey[90] : grey[10], secondary: mode === 'light' ? grey[70] : grey[40] }
  },
  typography: {
    fontFamily: '"Montserrat","Roboto","Arial",sans-serif',
    displayLarge: { fontSize: 64, lineHeight: '72px', fontWeight: 700 },
    displayMedium: { fontSize: 57, lineHeight: '64px', fontWeight: 700 },
    displaySmall: { fontSize: 45, lineHeight: '52px', fontWeight: 700 },
    headlineLarge: { fontSize: 32, lineHeight: '40px', fontWeight: 600 },
    headlineMedium: { fontSize: 28, lineHeight: '36px', fontWeight: 600 },
    headlineSmall: { fontSize: 24, lineHeight: '32px', fontWeight: 600 },
    titleLarge: { fontSize: 22, lineHeight: '28px', fontWeight: 600 },
    titleMedium: { fontSize: 16, lineHeight: '24px', fontWeight: 600 },
    titleSmall: { fontSize: 14, lineHeight: '20px', fontWeight: 600 },
    bodyLarge: { fontSize: 16, lineHeight: '26px', fontWeight: 400 },
    bodyMedium: { fontSize: 14, lineHeight: '22px', fontWeight: 400 },
    bodySmall: { fontSize: 12, lineHeight: '18px', fontWeight: 400 },
    labelLarge: { fontSize: 14, lineHeight: '20px', fontWeight: 700, textTransform: 'uppercase' },
    labelMedium: { fontSize: 12, lineHeight: '16px', fontWeight: 600, textTransform: 'uppercase' },
    labelSmall: { fontSize: 11, lineHeight: '16px', fontWeight: 600, textTransform: 'uppercase' }
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    shadow(alpha(grey[100], .1)),
    shadow(alpha(grey[100], .15)),
    shadow(alpha(grey[100], .18)),
    shadow(alpha(grey[100], .22))
  ],
  components: {
    MuiPaper: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: ({ theme }) => ({
          outline: `1px solid ${outline(theme.palette.mode)}`,
          backdropFilter: 'blur(6px)'
        })
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: false, size: 'large' },
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 56,
          padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[2],
          '&:hover': { boxShadow: theme.shadows[3] },
          '&:active': { boxShadow: theme.shadows[1] },
          '&.Mui-focusVisible': { outline: `3px solid ${alpha(theme.palette.primary.main, .35)}` }
        }),
        containedPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.grey[0]
        }),
        containedSecondary: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.grey[0]
        })
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(1),
          '&:hover': { backgroundColor: alpha(theme.palette.action.active, .08) }
        })
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: outline(theme.palette.mode),
          '&.Mui-selected': { backgroundColor: theme.palette.primary.main, color: theme.palette.grey[0] }
        })
      }
    },
    MuiSlider: {
      styleOverrides: {
        rail: ({ theme }) => ({ backgroundColor: outline(theme.palette.mode) }),
        track: ({ theme }) => ({ backgroundColor: theme.palette.primary.main }),
        thumb: ({ theme }) => ({ backgroundColor: theme.palette.primary.main, boxShadow: theme.shadows[1] })
      }
    }
  }
})
