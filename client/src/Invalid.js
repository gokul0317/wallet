import React from 'react'
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Invalid() {
  return (
    <Stack style={{ width: "100%", height: "100%" }} justifyContent="center" alignItems="center">
      <Typography variant='h4'>Not Found</Typography>
    </Stack>
  )
}
