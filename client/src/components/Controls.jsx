import { Box, Button, FormControl, InputLabel, MenuItem, Select, Slider, Stack, Typography } from '@mui/material';

export const TRADE_TYPES = ['Export', 'Import', 'Re-Export'];

export function Filters({ onSearch, children }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }} useFlexGap flexWrap='wrap' sx={{ mb: 3 }}>
      {children}
      <Button variant='contained' size='large' onClick={onSearch}>Search</Button>
    </Stack>
  );
}

export function Picker({ label, value, onChange, options }) {
  // Keep a default selection valid while the options are still loading
  const choices = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <FormControl size='small' sx={{ minWidth: 220 }}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={e => onChange(e.target.value)} MenuProps={{ PaperProps: { sx: { maxHeight: 360 } } }}>
        {choices.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

export function RangeSlider({ label, unit = '', value, onChange, min, max, step }) {
  const format = number => `${number}${unit}`;
  return (
    <Box sx={{ flex: 1, minWidth: 200, px: 1 }}>
      <Typography variant='body2' fontWeight={600} noWrap>{label}</Typography>
      <Typography variant='body2' color='text.secondary'>{format(value[0])} to {format(value[1])}</Typography>
      <Slider value={value} min={min} max={max} step={step} onChange={(_, newValue) => onChange(newValue)} valueLabelDisplay='auto' valueLabelFormat={format} />
    </Box>
  );
}
