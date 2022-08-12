import Box from '@mui/material/Box';
import { useState } from 'react';

export interface IShowHideButtonProps {
    data: any;
    cb: any;
}

export default function ShowHideButton({ cb, data }: IShowHideButtonProps) {
    const [isHidden, setIsHidden] = useState(false)

    const handleClick = () => {
        if (isHidden) {
            setIsHidden(false)
            cb(data, true)
        } else {
            setIsHidden(true)
            cb(data, false)
        }
    }

    return (
        <Box display="flex" onClick={handleClick}>
            {isHidden ? "Show" : "Hide"}
        </Box>
    );
}
