import { Box, styled } from '@mui/material';
import { flexbox } from '@mui/system';
import { useState } from 'react';
import Map, { MapboxEvent } from 'react-map-gl';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '95%',
  height: 'calc(100% - 248px)',
  border: '1px solid #4a4242',
  overflow: 'hidden',
}));

const Maps = () => {
  const [viewState, setViewState] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <StyledBox>
      <Map
        {...viewState}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{
          height: '100%',
          width: '100%',
        }}
        mapStyle={'mapbox://styles/mapbox/streets-v11'}
        onMove={(evt) => setViewState(evt.viewState)}
        // onRender={(event) => event.target.resize()}
      />
    </StyledBox>
  );
};

export default Maps;
