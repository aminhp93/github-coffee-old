import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import * as React from 'react';
import { useState } from 'react';
import { COLORS } from './utils';

interface IProps {
    color?: string;
    cb?: any;
}

export default function ColorPopover({ color: defaultColor, cb }: IProps) {
    const [color, setColor] = useState(defaultColor)
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectColor = (data: any) => {
        setColor(data)
        cb && cb(data)
        handleClose()
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Button
                style={{ width: "20px", height: "20px", background: color, minWidth: 0, padding: 0 }}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick} />

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {COLORS.map((i: any, index: number) => {
                    return <Button
                        key={index}
                        style={{ width: "20px", height: "20px", background: i, minWidth: 0, padding: 0 }}
                        aria-describedby={id}
                        variant="contained"
                        onClick={() => handleSelectColor(i)} />
                })}
            </Popover>
        </>
    );
}
