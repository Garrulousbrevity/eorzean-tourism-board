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
    >
      <Radio
        checkedIcon={<Brightness7Icon />}
        icon={<Brightness7Icon />}
        value="light"
      />
      <Radio checkedIcon={<Computer />} icon={<Computer />} value="system" />
      <Radio
        checkedIcon={<Brightness4Icon />}
        icon={<Brightness4Icon />}
        value="dark"
      />
    </RadioGroup>
  );
}

export default ThemePicker;
