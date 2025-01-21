/* eslint-disable jsx-a11y/no-static-element-interactions */
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { MoveHandler, NodeApi, NodeRendererProps, Tree } from 'react-arborist';

import { Box } from '../../Box';
import { Icon } from '../../Icon';
import { Loader } from '../loader/Loader';

import styles from './treeview.module.scss';

type BaseType<T> = T & {
  id: string;
  childrenCount?: number;
  children?: BaseType<T>[];
};

export type TreeViewDataType<T> = BaseType<T>;

const addAllChildren = <T,>(
  data: TreeViewDataType<T>[],
): TreeViewDataType<T>[] => {
  return data.map((item) => {
    return { ...item, children: item.children ?? [] };
  });
};

export type TreeViewProps<T> = {
  data: TreeViewDataType<T>[];
  allCanBeFolder?: boolean;
  rootNode: BaseType<T>;
  renderNode?: (node: TreeViewDataType<T>) => React.ReactNode;
  loadChildren?: (node: TreeViewDataType<T>) => Promise<TreeViewDataType<T>[]>;
  afterMove?: (
    nodeId: string,
    newIndex: number,
    newParentId: string | null,
  ) => void;
};

type ArgumentTypes<T> = Parameters<MoveHandler<TreeViewDataType<T>>>;

export const TreeView = <T,>({
  data: initialData,
  allCanBeFolder,
  rootNode,
  renderNode,
  loadChildren,
  afterMove,
}: TreeViewProps<T>) => {
  const [data, setData] = useState(
    allCanBeFolder ? addAllChildren(initialData) : initialData,
  );

  const onMove3 = (args: {
    dragIds: string[];
    dragNodes: NodeApi<BaseType<T>>[];
    parentId: string | null;
    parentNode: NodeApi<BaseType<T>> | null;
    index: number;
  }): {
    targetNodeId: string;
    mode: 'first-child' | 'last-child' | 'left' | 'right';
  } | null => {
    const newData = JSON.parse(JSON.stringify(data)) as TreeViewDataType<T>[];

    const newIndex = args.index;
    const targetNodeId = args.parentId ?? rootNode.id;
    const children = args.parentId
      ? (args.parentNode?.children ?? [])
      : newData;

    if (newIndex === 0) {
      return { targetNodeId: targetNodeId, mode: 'first-child' };
    }
    if (newIndex === children.length) {
      return { targetNodeId: targetNodeId, mode: 'last-child' };
    }

    const siblingIndex = newIndex - 1;
    const sibling = children[siblingIndex];

    if (sibling) {
      return { targetNodeId: sibling.id, mode: 'right' };
    }

    const nextSiblingIndex = newIndex + 1;
    const nextSibling = children[nextSiblingIndex];
    if (nextSibling) {
      return { targetNodeId: nextSibling.id, mode: 'left' };
    }

    return null;
  };

  const onMove = (args: {
    dragIds: string[];
    dragNodes: NodeApi<BaseType<T>>[];
    parentId: string | null;
    parentNode: NodeApi<BaseType<T>> | null;
    index: number;
  }) => {
    // Création d'une copie profonde pour éviter les mutations directes
    const newData = JSON.parse(JSON.stringify(data)) as TreeViewDataType<T>[];
    const draggedId = args.dragIds[0];

    // Fonction helper pour trouver et supprimer un nœud dans l'arbre
    const findAndRemoveNode = (
      items: TreeViewDataType<T>[],
      parentId?: string,
    ): {
      currentIndex: number;
      newIndex: number;
      parentId?: string;
      draggedNode: TreeViewDataType<T>;
    } | null => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === draggedId) {
          const currentIndex = i;
          let newIndex = args.index;
          if (currentIndex < newIndex) {
            newIndex -= 1;
          }
          return {
            currentIndex: i,
            parentId,
            newIndex,
            draggedNode: items.splice(i, 1)[0],
          };
        }
        if (items[i].children?.length) {
          const found = findAndRemoveNode(
            items[i]?.children ?? [],
            items[i].id,
          );
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    // Trouver et supprimer le nœud déplacé
    const r = findAndRemoveNode(newData);
    const draggedNode = r?.draggedNode;
    const currentIndex = r?.currentIndex ?? -1;
    const newIndex = r?.newIndex ?? -1;
    if (!draggedNode || currentIndex < 0 || newIndex < 0) {
      return;
    }

    // Cas 1: Déplacement à la racine
    if (!args.parentNode) {
      newData.splice(newIndex, 0, draggedNode);
      afterMove?.(draggedNode.id, newIndex, null);
    }
    // Cas 2: Déplacement dans un dossier
    else {
      const targetParent = args.parentNode.data;
      const findParentAndInsert = (items: TreeViewDataType<T>[]) => {
        for (const item of items) {
          if (item.id === targetParent.id) {
            item.children = item.children || [];
            item.children.splice(
              r.parentId === targetParent.id ? r.newIndex : args.index,
              0,
              draggedNode,
            );
            afterMove?.(draggedNode.id, newIndex, targetParent.id);
            return true;
          }
          if (item.children?.length) {
            if (findParentAndInsert(item.children)) {
              return true;
            }
          }
        }
        return false;
      };
      // console.log('newData', newData);
      findParentAndInsert(newData);
    }

    console.log('onMove --- ', onMove3(args));
    setData(newData);
  };

  useEffect(() => {
    // console.log('initialData', initialData);
    setData(allCanBeFolder ? addAllChildren(initialData) : initialData);
  }, [initialData, setData, allCanBeFolder]);

  return (
    <Box className={styles.container}>
      <Tree
        data={data}
        openByDefault={false}
        height={1000}
        indent={20}
        width={280}
        rowHeight={28}
        overscanCount={1}
        paddingTop={30}
        paddingBottom={10}
        padding={25}
        onMove={onMove as MoveHandler<TreeViewDataType<T>>}
      >
        {(props) => (
          <Node
            {...props}
            renderNode={renderNode}
            loadChildren={loadChildren}
          />
        )}
      </Tree>
      e
    </Box>
  );
};

export type NodeProps<T> = NodeRendererProps<TreeViewDataType<T>> & {
  renderNode?: (node: TreeViewDataType<T>) => React.ReactNode;
  loadChildren?: (node: TreeViewDataType<T>) => Promise<TreeViewDataType<T>[]>;
};

export const Node = <T,>({
  renderNode,
  node,
  dragHandle,
  style,
  loadChildren,
}: NodeProps<T>) => {
  /* This node instance can do many things. See the API reference. */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasChildren =
    (node.data.childrenCount !== undefined && node.data.childrenCount > 0) ||
    (node.data.children?.length ?? 0) > 0;
  const isLeaf = node.isLeaf || !hasChildren;

  const hasLoadedChildren = node.children?.length ?? 0 > 0;

  const hasLoadedAllChildren =
    !hasChildren || node.data.childrenCount === undefined
      ? true
      : node.children?.length === (node.data.childrenCount ?? 0);

  const handleClick = async () => {
    // console.log('clicked', isLeaf, hasLoadedAllChildren);
    if (isLeaf) {
      return;
    }

    if (hasLoadedAllChildren) {
      node.toggle();
      return;
    }

    // console.log('loading');
    setIsLoading(true);
    await loadChildren?.(node.data);
    setIsLoading(false);
    node.toggle();
    // console.log('loading off');
  };

  useEffect(() => {
    if (node.willReceiveDrop && !node.isOpen) {
      timeoutRef.current = setTimeout(() => {
        void handleClick();
      }, 500);
    }

    if (timeoutRef.current && !node.willReceiveDrop) {
      clearTimeout(timeoutRef.current);
    }
  }, [node]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={clsx(styles.node, {
        [styles.willReceiveDrop]: node.willReceiveDrop,
        [styles.selected]: node.isSelected,
      })}
      style={{
        ...style,
      }}
      ref={dragHandle}
    >
      {isLeaf ? (
        <Box $padding={{ left: '24px' }} />
      ) : (
        <>
          {isLoading ? (
            <Box $padding={{ horizontal: '4px' }}>
              <Loader />
            </Box>
          ) : (
            <Icon
              onClick={() => void handleClick()}
              $variation="400"
              iconName={
                node.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
              }
            />
          )}
        </>
      )}
      {renderNode?.(node.data)}
    </div>
  );
};
