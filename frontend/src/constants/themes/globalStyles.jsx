import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }

  nav {
    background-color: ${({ theme }) => theme.navbarBg};
    color: ${({ theme }) => theme.text};
    
  }

  footer {
    background-color: ${({ theme }) => theme.footerBg};
    color: ${({ theme }) => theme.footerText};
  }
`;
