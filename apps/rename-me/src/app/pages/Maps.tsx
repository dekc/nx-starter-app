import { Box, styled, useTheme } from '@mui/material';
import { useState } from 'react';
import Map from 'react-map-gl';

const mapMode = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/streets-v11',
};

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'calc(100% - 64px)', // 64px is the height of the footer
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: '95%',
  height: '95%',
  border: '1px solid #4a4242',
  overflow: 'hidden',
}));

const Maps = () => {
  const theme = useTheme();
  const [viewState, setViewState] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <StyledContainer>
      <StyledBox>
        <Map
          {...viewState}
          reuseMaps
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          style={{
            height: '100%',
            width: '100%',
          }}
          mapStyle={mapMode[theme.palette.mode]}
          onMove={(evt) => setViewState(evt.viewState)}
          // onRender={(event) => event.target.resize()}
        />
      </StyledBox>
    </StyledContainer>
  );
};

export default Maps;
