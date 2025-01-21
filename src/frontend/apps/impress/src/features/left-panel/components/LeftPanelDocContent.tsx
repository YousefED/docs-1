import { useState } from 'react';
import { css } from 'styled-components';

import { Box, SeparatedSection } from '@/components';
import { TreeView, TreeViewDataType } from '@/components/common/tree/TreeView';
import { useCunninghamTheme } from '@/cunningham';
import { useDocStore } from '@/features/docs/doc-management';
import { SimpleDocItem } from '@/features/docs/docs-grid';

import Logo from '../assets/doc-s.svg';

export type DataType = {
  id: string;
  name: string;
  wesh?: string;
  children?: DataType[];
};

const loadNodeChildren = async (
  node: TreeViewDataType<DataType>,
): Promise<TreeViewDataType<DataType>[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'c1', name: 'General' },
        { id: 'c2', name: 'Random' },
        { id: 'c3', name: 'Open Source Projects' },
      ]);
    }, 200);
  });
};

const initialData: TreeViewDataType<DataType>[] = [
  { id: 'Noeud #1', name: 'Noeud #1', children: [] },
  { id: 'Noeud #2', name: 'Noeud #2', children: [] },
  {
    id: 'Noeud #3',
    name: 'Noeud #3',
    childrenCount: 0,
    children: [],
  },
  {
    id: 'Noeud #4',
    name: 'Noeud #4',
    children: [
      { id: 'Noeud #4.1', name: 'Noeud #4.1' },
      { id: 'Noeud #4.2', name: 'Noeud #4.2' },
      { id: 'Noeud #4.3', name: 'Noeud #4.3' },
    ],
  },
  { id: 'Noeud #5', name: 'Noeud #5', children: [] },
];

export const LeftPanelDocContent = () => {
  const { currentDoc } = useDocStore();
  const { spacingsTokens } = useCunninghamTheme();
  const spacing = spacingsTokens();
  const [data, setData] = useState<TreeViewDataType<DataType>[]>(initialData);

  const loadChildren = async (node: TreeViewDataType<DataType>) => {
    console.log('loading children', node);
    const children = await loadNodeChildren(node);
    const newData = [...data];
    const index = newData.findIndex((n) => n.id === node.id);
    if (index > -1) {
      const childrenToReplace = newData[index].children ?? [];
      newData[index].children = [...childrenToReplace, ...children];
    }

    setData(newData);
    return newData;
  };

  if (!currentDoc) {
    return null;
  }

  return (
    <Box
      $flex={1}
      $width="100%"
      $css="width: 100%; overflow-y: auto; overflow-x: hidden;"
    >
      <SeparatedSection showSeparator={false}>
        <Box $padding={{ horizontal: 'sm' }}>
          <Box
            $css={css`
              padding: ${spacing['2xs']};
              border-radius: 4px;
              background-color: var(--c--theme--colors--greyscale-100);
            `}
          >
            <SimpleDocItem doc={currentDoc} showAccesses={true} />
          </Box>
        </Box>
      </SeparatedSection>
      <Box $padding={{ horizontal: 'sm' }}>
        <TreeView
          rootNode={currentDoc}
          data={data}
          loadChildren={loadChildren}
          afterMove={console.log}
          renderNode={(node) => (
            <Box $direction="row" $gap={spacing['xs']} $align="center">
              <Logo />

              {node.wesh || node.name}
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};
