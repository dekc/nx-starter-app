import { ReactNode, useState } from 'react';
import { Box, styled } from '@mui/material';

const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

interface LayoutProps {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
}

const Layout = ({ header, content, footer }: LayoutProps) => {
  const [showHeader] = useState(true);
  const [showContent] = useState(true);
  const [showFooter] = useState(true);

  return (
    <StyledContainer>
      {showHeader && header}

      {showContent && content}
      {showFooter && footer}
    </StyledContainer>
  );
};

export default Layout;
