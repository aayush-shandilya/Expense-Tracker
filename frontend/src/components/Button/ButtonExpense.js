// import React from 'react';
// import styled from 'styled-components';

// function ButtonExpenseStyled({
//     name,
//     icon,
//     onClick,
//     bg = '#ADD8E6',  // Default light blue
//     bPad = '0.5rem 1rem',
//     color = '#fff',
//     bRad = '4px',
//     iColor = '#fff',  // Icon color
//     hColor = '#FF0000',  // Hover color
//     type = 'button'
// }) {
//     return (
//         <ButtonExpenseStyled 
//             style={{
//                 background: bg,
//                 padding: bPad,
//                 borderRadius: bRad,
//                 color: color,
//             }}
//             onClick={onClick}
//             type={type}
//             hColor={hColor}
//             iColor={iColor}
//         >
//             {icon && <IconWrapper iColor={iColor}>{icon}</IconWrapper>}
//             {name}
//         </ButtonExpenseStyled>
//     );
// }

// const IconWrapper = styled.span`
//     color: ${props => props.iColor};
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 1.5rem;
// `;

// const ButtonExpenseStyled = styled.ButtonExpense`
//     outline: none;
//     border: none;
//     font-family: inherit;
//     font-size: inherit;
//     display: flex;
//     align-items: center;
//     gap: .5rem;
//     cursor: pointer;
//     transition: all .4s ease-in-out;

//     &:hover {
//         background: ${props => props.hColor || '#FF0000'} !important;
//     }
// `;

// export default ButtonExpense;


import React from 'react';
import styled from 'styled-components';

function ButtonExpense({
    name,
    icon,
    onClick,
    bg = '#ADD8E6',  // Default light blue
    bPad = '0.5rem 1rem',
    color = '#fff',
    bRad = '4px',
    iColor = '#fff',  // Icon color
    hColor = '#FF0000',  // Hover color
    type = 'button'
}) {
    return (
        <StyledButton 
            style={{
                background: bg,
                padding: bPad,
                borderRadius: bRad,
                color: color,
            }}
            onClick={onClick}
            type={type}
            hColor={hColor}
            iColor={iColor}
        >
            {icon && <IconWrapper iColor={iColor}>{icon}</IconWrapper>}
            {name}
        </StyledButton>
    );
}

const IconWrapper = styled.span`
    color: ${props => props.iColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
`;

const StyledButton = styled.button`
    outline: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
    display: flex;
    align-items: center;
    gap: .5rem;
    cursor: pointer;
    transition: all .4s ease-in-out;

    &:hover {
        background: ${props => props.hColor || '#FF0000'} !important;
    }
`;

export default ButtonExpense;
