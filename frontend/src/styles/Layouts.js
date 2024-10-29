// import styled from "styled-components";

// //This is a part of the styled-components library. It creates a styled div element. You can style other HTML elements like styled.button, styled.a, etc.


// export const MainLayout = styled.div`
//     padding: 2rem;
//     height: 100%;
//     display: flex;
//     gap: 2rem;
//     overflow: hidden;
// `;

// export const InnerLayout = styled.div`
//     padding: 2rem 1.5rem;
//     width: 100%;
    
// `;



import styled from "styled-components";

export const MainLayout = styled.div`
    padding: 2rem;
    height: 100vh;
    display: flex;
    gap: 2rem;
    overflow: hidden;
`;

export const InnerLayout = styled.div`
    padding: 2rem 1.5rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;