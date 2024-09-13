import { ChangeEvent, FC, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface InputType {
  name: string;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (name: string) => void;
  value?: string;
  isCloseIcon?: boolean;
  isSearchIcon?: boolean;
}

export const Input: FC<InputType> = ({
  name,
  placeholder = "",
  onChange = () => {},
  onClick,
  value = "",
  isCloseIcon = false,
  isSearchIcon = false
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`input-container ${isHovered || isFocused ? 'highlight' : ''}`}>
      {value && (
        <div className="input-icons">
          {isCloseIcon && <CloseIcon className="icon" onClick={() => onClick && onClick(name)} />}
          {isSearchIcon && <SearchIcon className="icon" />}
        </div>
      )}
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="input"
      />
    </div>
  );
};
