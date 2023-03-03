import React from 'react';
import { Radio, RadioGroup } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Computer from '@mui/icons-material/Computer';

function ThemePicker({ theme, onChangeTheme }) {
  return (
    <RadioGroup
      value={theme}
      onChange={({ target: { value } }) => onChangeTheme(value)}
      row
      color="inherit"
    >
      <Radio
        checkedIcon={<Brightness7Icon color="secondary" />}
        icon={<Brightness7Icon />}
        value="light"
      />
      <Radio
        checkedIcon={<Computer color="secondary" />}
        icon={<Computer />}
        value="system"
      />
      <Radio
        checkedIcon={<Brightness4Icon color="secondary" />}
        icon={<Brightness4Icon />}
        value="dark"
      />
    </RadioGroup>
  );
}

export default ThemePicker;
