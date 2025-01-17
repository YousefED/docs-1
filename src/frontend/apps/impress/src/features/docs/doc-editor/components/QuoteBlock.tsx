import { defaultProps } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import React from 'react';

import { useCunninghamTheme } from '@/cunningham';

export const QuoteBlock = createReactBlockSpec(
  {
    type: 'quote',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
    },
    content: 'inline',
  },
  {
    render: (props) => {
      const { colorsTokens } = useCunninghamTheme();

      return (
        <div
          className="inline-content"
          style={{
            borderLeft: `4px solid ${colorsTokens()['greyscale-300']}`,
            margin: '0 0 1rem 0',
            padding: '0.5rem 1rem',
            color: colorsTokens()['greyscale-600'],
            fontStyle: 'italic',
            flexGrow: 1,
          }}
          ref={props.contentRef}
        />
      );
    },
    parse: (element) => {
      console.log('ok', element.textContent);
      return undefined;
    },
  },
);
