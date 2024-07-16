// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TooltipHost } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling';
import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Tooltip,
} from '@fluentui/react-components';
import { MoreVerticalRegular } from '@fluentui/react-icons';
import {
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { Icons } from 'common/icons/fluentui-v9-icons';
import { MoreActionsMenuIcon } from 'common/icons/more-actions-menu-icon';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { Toast, ToastDeps } from '../toast';
import styles from './card-footer-instance-action-buttons.scss';
import { CardInteractionSupport } from './card-interaction-support';

registerIcons({
    icons: {
        MoreActionsMenuIcon: <MoreActionsMenuIcon />,
    },
});

export type CardFooterInstanceActionButtonsDeps = {
    cardInteractionSupport: CardInteractionSupport;
    cardFooterMenuItemsBuilder: CardFooterMenuItemsBuilder;
    cardsViewController: CardsViewController;
} & ToastDeps &
    CardFooterMenuItemsDeps;

export interface CardFooterInstanceActionButtonsProps {
    deps: CardFooterInstanceActionButtonsDeps;
    userConfigurationStoreData: UserConfigurationStoreData | null;
    issueDetailsData: CreateIssueDetailsTextData;
    kebabMenuAriaLabel?: string;
    narrowModeStatus?: NarrowModeStatus;
}

export const CardFooterInstanceActionButtons = (props) => {
    const toastRef = React.useRef(null);
    const fileIssueButtonRef = React.useRef(null);
    const kebabButtonRef = React.useRef(null);
    const test = React.useRef(null)

    const focusButtonAfterDialogClosed = (): void => {
        if (props?.narrowModeStatus?.isCardFooterCollapsed) {
            kebabButtonRef?.current?.focus();
        } else {
            fileIssueButtonRef?.current?.removeAttribute('textprediction');
            fileIssueButtonRef?.current?.setAttribute('writingsuggestions', 'false')
            fileIssueButtonRef?.current?.focus();
            test?.current?.focus()
        }
    };

    const getMenuItems = () => {
        return props.deps.cardFooterMenuItemsBuilder.getCardFooterMenuItems({
            ...props,
            toastRef: toastRef,
            fileIssueButtonRef: ref => (fileIssueButtonRef.current = ref),
            onIssueFilingSettingsDialogDismissed: focusButtonAfterDialogClosed,
        });
    };

    const renderCopyFailureDetailsToast = () => {
        const { cardInteractionSupport } = props.deps;

        if (!cardInteractionSupport.supportsCopyFailureDetails) {
            return null;
        }

        return <Toast ref={toastRef} deps={props.deps} />;
    };


    const renderKebabButton = () => {
        return (
            <>
                <Tooltip content="More actions" relationship="description">
                    <Menu>
                        <MenuTrigger>
                            <MenuButton className={styles.menuButton} ref={ref => kebabButtonRef.current = ref} appearance="transparent" icon={<MoreVerticalRegular />} />
                        </MenuTrigger>
                        <MenuPopover
                            style={{
                                padding: 'unset !important',
                                border: 'unset !important',
                                borderRadius: 'unset !important',
                            }}
                        >
                            {/* <MenuList children={
                                getMenuItems().map((item, index) => {
                                    console.log('here==>', `${item.key}-${index}-kebabButton`);
                                    return (
                                        <>
                                            <MenuItem
                                                children={<span key={`${item.key}-${index}-kebabButton`}>{item?.text}</span>}
                                                componentRef={ref => (kebabButtonRef.current = ref)}
                                                className={styles.kebabMenuIcon}
                                                icon={Icons[item?.iconName]}
                                                {...item}
                                            />
                                        </>
                                    )
                                })
                            } /> */}
                            {/* <MenuListComponent items={menuItems} /> */}
                            <MenuList>
                                {getMenuItems().map((item: any, index: number) => (

                                    <MenuItem

                                        className={styles.kebabMenuIcon}
                                        //key={item.key}
                                        key={`${item.key}-${index}-kebabMenuItem`}
                                        icon={Icons[item?.iconName]}
                                        {...item}
                                    >
                                        {item?.text}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </Tooltip>
            </>
        );
    };

    const renderExpandedButtons = () => {
        const menuItems = getMenuItems();
        console.log('inside expanded button')
        return (
            <>
                {menuItems.map(props => (
                    // <span key={`${props.key}-expandedButtons`}>
                    <Button
                        as="button"
                        appearance="transparent"
                        onClick={props.onClick}
                        icon={Icons[props.iconName]}
                        className={styles[props.key]}
                        size="medium"
                        //ref={() => test}
                        //ref={ref => (props.componentRef = ref)}
                        ref={ref => props.componentRef = ref}
                        key={`${props.key}-expandedButtons`}
                    >
                        {props.text}
                    </Button>
                    // </span>
                ))}
            </>
        );
    };

    const renderButtons = () => {
        if (props.narrowModeStatus?.isCardFooterCollapsed) {
            return renderKebabButton();
        } else {
            return renderExpandedButtons();
        }
    };

    const menuItems = getMenuItems();

    const menuItemsJsx = menuItems?.length == 0 ? null : <div onKeyDown={event => event.stopPropagation()}>
        {renderButtons()}
        {renderCopyFailureDetailsToast()}
    </div>

    return menuItemsJsx;
};
