import { render } from '@testing-library/react';

import EnvUtils from './env-utils';

describe('EnvUtils', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EnvUtils />);
    expect(baseElement).toBeTruthy();
  });
});
