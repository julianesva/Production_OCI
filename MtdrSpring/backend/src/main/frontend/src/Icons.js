import { IconUser, IconCaretDown, IconCaretUp, IconCaretRight, IconCaretLeft, IconTrash } from '@tabler/icons-react';

export const User_Icon = ({ color = "black", w = "30px", h = "30px"  }) => {
    return (
        <IconUser stroke={2} color={color} width={w} height={h} />
    )
}

export const Arrow_Down_Icon = ({ color = "black", w = "30px", h = "30px" }) => {
    return (
        <IconCaretDown stroke={2} color={color} width={w} height={h} />
    )
}

export const Arrow_Up_Icon = ({ color = "black", w = "30px", h = "30px" }) => {
    return (
        <IconCaretUp stroke={2} color={color} width={w} height={h} />
    )
}

export const Arrow_Right_Icon = ({ color = "black", w = "30px", h = "30px" }) => {
    return (
        <IconCaretRight stroke={2} color={color} width={w} height={h} />
    )
}

export const Arrow_Left_Icon = ({ color = "black", w = "30px", h = "30px" }) => {
    return (
        <IconCaretLeft stroke={2} color={color} width={w} height={h} />
    )
}

export const Trash_Icon = ({ color = "black", w = "30px", h = "30px" }) => {
    return (
        <IconTrash stroke={2} color={color} width={w} height={h} />
    )
}