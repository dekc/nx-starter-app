import styled from 'styled-components';

/* eslint-disable-next-line */
export interface EnvUtilsProps {}

const StyledEnvUtils = styled.div`
  color: pink;
`;

const WELCOME_MSG = import.meta.env.VITE_WELCOME_MSG ?? 'Welcome to EnvUtils!';

export function EnvUtils(props: EnvUtilsProps) {
  return (
    <StyledEnvUtils>
      <h1>{WELCOME_MSG}!</h1>
    </StyledEnvUtils>
  );
}

export default EnvUtils;
