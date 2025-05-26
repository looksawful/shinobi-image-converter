// src/components/Footer.jsx
import { Snackbar, Alert } from '@mui/material'
import useStore from '../store'

export default function Footer() {
  const snack = useStore(s => s.snackbar)
  return (
    <Snackbar open={!!snack}>
      {snack && <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>}
    </Snackbar>
  )
}
