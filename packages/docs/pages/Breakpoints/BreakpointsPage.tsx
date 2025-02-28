import { Box, H0, Text } from '@bigcommerce/big-design';
import { breakpointValues } from '@bigcommerce/big-design-theme';
import React from 'react';
import styled from 'styled-components';

import { Code, CodePreview } from '../../components';

export default () => (
  <>
    <H0>Breakpoints</H0>

    <Text>
      We provide access to our breakpoints' <Code>@media</Code> queries. Our breakpoints include{' '}
      <Code primary>mobile</Code>, <Code primary>tablet</Code> and <Code primary>desktop</Code> . Values for each
      breakpoint are <Code>{breakpointValues.mobile}</Code>, <Code>{breakpointValues.tablet}</Code>, and{' '}
      <Code>{breakpointValues.desktop}</Code> respectively.
    </Text>

    <CodePreview noInline>
      {/* jsx-to-string:start */}
      {function Example() {
        const StyledBox = styled(Box)`
          height: ${({ theme }) => theme.spacing.xxxLarge};
          width: 100%;

          ${({ theme }) => theme.breakpoints.tablet} {
            width: 60%;
          }

          ${({ theme }) => theme.breakpoints.desktop} {
            width: 30%;
          }
        `;

        return <StyledBox backgroundColor="secondary20" />;
      }}
      {/* jsx-to-string:end */}
    </CodePreview>

    <Text>
      We also expose the <Code primary>breakpointValues</Code> for each breakpoint.
    </Text>

    <CodePreview noInline>
      {/* jsx-to-string:start */}
      {function Example() {
        const StyledBox = styled(Box)`
          height: ${({ theme }) => theme.spacing.xxxLarge};
          width: 100%;

          ${({ theme }) => theme.breakpoints.desktop} {
            width: ${({ theme }) => theme.breakpointValues.tablet};
          }
        `;

        return <StyledBox backgroundColor="secondary20" />;
      }}
      {/* jsx-to-string:end */}
    </CodePreview>
  </>
);
