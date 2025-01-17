import { defaultProps } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import { Menu } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useCunninghamTheme } from '@/cunningham';

// The types of alerts that users can choose from.
export const alertTypes = [
  {
    title: 'Warning',
    value: 'warning',
    icon: 'warning',
    color: 'warning-500',
    backgroundColor: 'warning-300',
  },
  {
    title: 'Error',
    value: 'error',
    icon: 'error',
    color: 'danger-500',
    backgroundColor: 'danger-300',
  },
  {
    title: 'Info',
    value: 'info',
    icon: 'info',
    color: 'info-500',
    backgroundColor: 'info-300',
  },
  {
    title: 'Success',
    value: 'success',
    icon: 'check_circle',
    color: 'success-500',
    backgroundColor: 'success-100',
  },
] as const;

// The Alert block.
export const Alert = createReactBlockSpec(
  {
    type: 'alert',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: 'warning',
        values: ['warning', 'error', 'info', 'success'],
      },
    },
    content: 'inline',
  },
  {
    render: (props) => {
      const { colorsTokens } = useCunninghamTheme();
      const { t } = useTranslation();
      const alertType = alertTypes.find(
        (a) => a.value === props.block.props.type,
      )!;

      return (
        <div
          className="alert"
          data-alert-type={props.block.props.type}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            borderRadius: '4px',
            minHeight: '48px',
            padding: '4px',
            backgroundColor: colorsTokens()[alertType.backgroundColor],
          }}
        >
          <Menu withinPortal={false}>
            <Menu.Target>
              <div
                className="alert-icon-wrapper"
                style={{
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '12px',
                  marginRight: '12px',
                  height: '24px',
                  width: '24px',
                  userSelect: 'none',
                  cursor: 'pointer',
                }}
                contentEditable={false}
              >
                <span
                  className="material-icons"
                  style={{
                    color: colorsTokens()[alertType.color],
                    fontSize: '20px',
                  }}
                >
                  {alertType.icon}
                </span>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{t('Alert Type')}</Menu.Label>
              <Menu.Divider />
              {alertTypes.map((type) => (
                <Menu.Item
                  key={type.value}
                  leftSection={
                    <span
                      className="material-icons"
                      style={{
                        color: colorsTokens()[type.color],
                        fontSize: '16px',
                      }}
                    >
                      {type.icon}
                    </span>
                  }
                  onClick={() =>
                    props.editor.updateBlock(props.block, {
                      type: 'alert',
                      props: { type: type.value },
                    })
                  }
                >
                  {t(type.title)}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <div
            className="inline-content"
            style={{ flexGrow: 1 }}
            ref={props.contentRef}
          />
        </div>
      );
    },
  },
);
