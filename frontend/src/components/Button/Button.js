// // // import React from 'react'
// // // import styled from 'styled-components'

// // // function Button({name, icon, onClick, bg, bPad, color, bRad}) {
// // //     return (
// // //         <ButtonStyled style={{
// // //             background: bg,
// // //             padding: bPad,
// // //             borderRadius: bRad,
// // //             color: color,
// // //         }} onClick={onClick}>
// // //             {icon}
// // //             {name}
// // //         </ButtonStyled>
// // //     )
// // // }

// // // const ButtonStyled = styled.button`
// // //     outline: none;
// // //     border: none;
// // //     font-family: inherit;
// // //     font-size: inherit;
// // //     display: flex;
// // //     align-items: center;
// // //     gap: .5rem;
// // //     cursor: pointer;
// // //     transition: all .4s ease-in-out;
// // // `;


// // // export default Button



// // //components/Button/Button.js
// // import React, { Component } from 'react';
// // import styled from 'styled-components';

// // function Button({name, icon, onClick, bg, bPad, color, bRad, hColor}) {
// //     console.log('Button props:', { icon, onClick, bg, color, bPad, bRad, hColor });
    
// //     return (
// //         <ButtonStyled 
// //             style={{
// //                 background: bg,
// //                 padding: bPad,
// //                 borderRadius: bRad,
// //                 color: color,
// //             }} 
// //             onClick={onClick}
// //             hColor={hColor}
// //         >
// //             {icon}
// //             {name}
// //         </ButtonStyled>
// //     )
// // }

// // const ButtonStyled = styled.button`
// //     outline: none;
// //     border: none;
// //     font-family: inherit;
// //     font-size: inherit;
// //     display: flex;
// //     align-items: center;
// //     gap: .5rem;
// //     cursor: pointer;
// //     transition: all .4s ease-in-out;
// //     &:hover {
// //         background: ${props => props.hColor || '#fff'} !important;
// //         color: ${props => props.color || '#000'};
// //     }
// //     i {
// //         font-size: 1.5rem;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //     }
// // `;

// // export default Button;


// // import React from 'react';
// // import styled from 'styled-components';

// // function Button({name, icon, onClick, bg, bPad, color, bRad, hColor, type = 'button'}) {
// //     return (
// //         <ButtonStyled 
// //             style={{
// //                 background: bg,
// //                 padding: bPad,
// //                 borderRadius: bRad,
// //                 color: color,
// //             }}
// //             onClick={onClick}
// //             type={type}
// //             hColor={hColor}
// //         >
// //             {icon}
// //             {name}
// //         </ButtonStyled>
// //     )
// // }

// // const ButtonStyled = styled.button`
// //     outline: none;
// //     border: none;
// //     font-family: inherit;
// //     font-size: inherit;
// //     display: flex;
// //     align-items: center;
// //     gap: .5rem;
// //     cursor: pointer;
// //     transition: all .4s ease-in-out;
// //     &:hover {
// //         background: ${props => props.hColor || '#fff'} !important;
// //         color: ${props => props.color || '#000'};
// //     }
// //     i {
// //         font-size: 1.5rem;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //     }
// // `;

// // export default Button;



// // import React from 'react';
// // import styled from 'styled-components';

// // function Button({ name, icon, onClick, bg = '#007BFF', bPad = '0.5rem 1rem', color = '#fff', bRad = '4px', hColor = '#0056b3', type = 'button' }) {
// //     return (
// //         <ButtonStyled 
// //             style={{
// //                 background: bg,
// //                 padding: bPad,
// //                 borderRadius: bRad,
// //                 color: color,
// //             }}
// //             onClick={onClick}
// //             type={type}
// //             hColor={hColor}
// //         >
// //             {icon}
// //             {name}
// //         </ButtonStyled>
// //     );
// // }

// // const ButtonStyled = styled.button`
// //     outline: none;
// //     border: none;
// //     font-family: inherit;
// //     font-size: inherit;
// //     display: flex;
// //     align-items: center;
// //     gap: .5rem;
// //     cursor: pointer;
// //     transition: all .4s ease-in-out;
// //     background: ${props => props.bg || '#007BFF'};
// //     color: ${props => props.color || '#fff'};
    
// //     &:hover {
// //         background: ${props => props.hColor || '#0056b3'} !important;
// //         color: ${props => props.color || '#fff'};
// //     }

// //     i {
// //         font-size: 1.5rem;
// //         display: flex;
// //         align-items: center;
// //         justify-content: center;
// //     }
// // `;

// // export default Button;


// //Button/Button.js
// import React from 'react';
// import styled from 'styled-components';

// function Button({ 
//     name, 
//     icon, 
//     onClick, 
//     bg = '#ADD8E6', // Light blue default color
//     bPad = '0.5rem 1rem', 
//     color = '#fff', 
//     bRad = '4px', 
//     hColor = '#FF0000', // Red hover color
//     type = 'button' 
// }) {
//     return (
//         <ButtonStyled 
//             style={{
//                 background: bg,
//                 padding: bPad,
//                 borderRadius: bRad,
//                 color: color,
//             }}
//             onClick={onClick}
//             type={type}
//             hColor={hColor}
//         >
//             {icon}
//             {name}
//         </ButtonStyled>
//     );
// }

// const ButtonStyled = styled.button`
//     outline: none;
//     border: none;
//     font-family: inherit;
//     font-size: inherit;
//     display: flex;
//     align-items: center;
//     gap: .5rem;
//     cursor: pointer;
//     transition: all .4s ease-in-out;
//     background: ${props => '#ADD8E6'};
//     color: ${props => '#fff'};
    
//     &:hover {
//         background: ${props => props.hColor || '#FF0000'} !important;
//         color: ${props => props.color || '#fff'};
//     }

//     i {
//         font-size: 1.5rem;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//     }
// `;

// export default Button;



import React from 'react';
import styled from 'styled-components';

function Button({
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
        <ButtonStyled 
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
        </ButtonStyled>
    );
}

const IconWrapper = styled.span`
    color: ${props => props.iColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
`;

const ButtonStyled = styled.button`
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

export default Button;