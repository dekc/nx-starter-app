import { ReactNode, useState } from 'react';
import { Box, styled } from '@mui/material';

const StyledContainer = styled(Box)({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
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
