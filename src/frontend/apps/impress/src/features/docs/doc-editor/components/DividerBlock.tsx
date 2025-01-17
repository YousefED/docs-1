import { defaultProps } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';

import { useCunninghamTheme } from '@/cunningham';

export const DividerBlock = createReactBlockSpec(
  {
    type: 'divider',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
    },
    content: 'none',
  },
  {
    render: () => {
      const { colorsTokens } = useCunninghamTheme();

      return (
        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: colorsTokens()['greyscale-300'],
            margin: '1rem 0',
          }}
        />
      );
    },
  },
);
