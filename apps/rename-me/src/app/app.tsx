import styled from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/Layout';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Content from './layout/Content';
import Theme from './theme/Theme';
import { provider } from 'react-ioc';
import { ThemeDataStore } from './theme/ThemeDataStore';
import { AppDataStore } from './stores/AppDataStore';
import { routes } from './routes';

const StyledApp = styled.div`
  // Your style here
`;

function App() {
  return (
    <StyledApp>
      <Theme>
        <BrowserRouter>
          <Layout
            header={<Header />}
            content={<Content routes={routes} />}
            footer={<Footer />}
          />
        </BrowserRouter>
      </Theme>
    </StyledApp>
  );
}

export default provider(AppDataStore, ThemeDataStore)(App);
