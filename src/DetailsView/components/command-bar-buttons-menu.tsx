// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButton,
    IButton,
    IContextualMenuItem,
    IRefObject,
    TooltipHost,
} from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import * as React from 'react';
import styles from './command-bar-buttons-menu.scss';
import { Menu, MenuButton, MenuItem, MenuItemProps, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element | null;
    saveAssessmentButton?: JSX.Element | null;
    loadAssessmentButton?: JSX.Element | null;
    transferToAssessmentButton?: JSX.Element | null;
    getStartOverMenuItem: () => StartOverMenuItem;
    buttonRef: IRefObject<IButton>;
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const exportButton = props.renderExportReportButton();
        const overflowItems: any[] = [];

        if (exportButton != null) {
            overflowItems.push({
                key: 'export report',
                children: <div role="menuitem">{exportButton}</div>,
            });
        }
        if (props.saveAssessmentButton && props.loadAssessmentButton) {
            overflowItems.push(
                {
                    key: 'save assessment',
                    children: <div role="menuitem">{props.saveAssessmentButton}</div>,
                },
                {
                    key: 'load assessment',
                    children: <div role="menuitem">{props.loadAssessmentButton}</div>,
                },
            );
        }

        if (props.transferToAssessmentButton) {
            overflowItems.push({
                key: 'transfer to assessment',
                children: <div role="menuitem">{props.transferToAssessmentButton}</div>,
            });
        }

        overflowItems.push({
            key: 'start over',
            ...props.getStartOverMenuItem(),
        });
        //@ts-ignore
        return (
            <TooltipHost content="More actions" aria-label="More actions">
                {/* <CommandBarButton
                    ariaLabel="More actions"
                    className={styles.commandBarButtonsMenu}
                    role="button"
                    menuIconProps={{
                        iconName: 'More',
                        className: styles.commandBarButtonsMenuButton,
                    }}
                    menuProps={{ items: overflowItems, className: styles.commandBarButtonsSubmenu }}
                    componentRef={props.buttonRef}
                /> */}
                <Menu>
                    <MenuTrigger>
                        <MenuButton appearance="transparent" icon={<MoreHorizontalRegular />} className={styles.commandBarButtonsMenuButton} />
                    </MenuTrigger>
                    <>
                        <MenuPopover>

                            {/* {overflowItems.map((item, index) => item.children)} */}

                            <MenuList>
                                {overflowItems.map((item, index) => item?.children?.props?.children?.props?.hasSubMenu ? item.children : <MenuItem className={styles.menuItem} key={index} {...props}>{item?.children}</MenuItem>)}
                            </MenuList>

                        </MenuPopover>
                    </>
                </Menu>
            </TooltipHost>
        );
    },
);
