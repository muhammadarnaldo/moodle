// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * React frontend for the Recently accessed items block.
 *
 * @module     block_recentlyaccesseditems/RecentlyAccessedItems
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useId, useRef, useState} from 'react';
import {Button} from '@moodlehq/design-system';
import {requireAsync} from '@moodle/lms/core/amd';
import log from '@moodle/lms/core/log';
import EmptyState from '@moodle/lms/block_recentlyaccesseditems/EmptyState';
import RecentItem from '@moodle/lms/block_recentlyaccesseditems/RecentItem';
import {getRecentItems} from '@moodle/lms/block_recentlyaccesseditems/repository';
import type {RecentItemData} from '@moodle/lms/block_recentlyaccesseditems/types';

/** Maximum number of recently accessed items to request. */
const MAX_ITEMS = 9;

/** Props supplied by the PHP block mount. */
export interface Props {
    /** URL of the empty state illustration. */
    noitemsimgurl: string;
    /** Translated loading status. */
    loadinglabel: string;
    /** Translated empty state message. */
    noitemslabel: string;
    /** Translated Show more button label. */
    moreitemslabel: string;
}

type State = {status: 'loading'} | {status: 'loaded'; items: RecentItemData[]} | {status: 'error'; error: unknown};

interface FilterEvents {
    notifyFilterContentUpdated: (nodes: HTMLElement[]) => void;
}

interface Notification {
    exception: (error: unknown) => Promise<void>;
}

/**
 * Preserve the existing five-card loading placeholder without a new skeleton dependency.
 *
 * @param props Component props.
 * @param props.label Translated status text.
 * @returns Decorative loading cards and a translated status message.
 */
function LoadingState({label}: {label: string}) {
    return (
        <div data-region="recentlyaccesseditems-loading-placeholder" role="status">
            <span className="visually-hidden">{label}</span>
            {Array.from({length: 5}, (_, index) => (
                <div className="card mb-1" key={index} aria-hidden="true">
                    <div className="card-body p-2 m-1">
                        <div className="d-flex flex-row mw-100 align-items-center">
                            <div className="bg-pulse-grey rounded-circle" style={{height: 40, width: 40}} />
                            <div className="ps-2 flex-grow-1">
                                <div className="bg-pulse-grey w-100" style={{height: '1rem'}} />
                                <div className="bg-pulse-grey w-75 mt-1" style={{height: '0.8rem'}} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Load and display up to nine recent items, preserving the sidebar/content region behaviour.
 *
 * Sidebar CSS hides the fourth and later cards until expanded. The content region displays
 * all cards and hides the Show more container from the start. Show more never fetches data.
 *
 * @param props Component props.
 * @param props.noitemsimgurl URL of the empty state illustration.
 * @param props.loadinglabel Translated loading status.
 * @param props.noitemslabel Translated empty state message.
 * @param props.moreitemslabel Translated Show more button label.
 * @returns The block content.
 */
export default function RecentlyAccessedItems({noitemsimgurl, loadinglabel, noitemslabel, moreitemslabel}: Props) {
    const [state, setState] = useState<State>({status: 'loading'});
    const [expanded, setExpanded] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const listId = useId();

    useEffect(() => {
        let active = true;
        getRecentItems(MAX_ITEMS).then(items => {
            if (active) {
                setState({status: 'loaded', items});
            }
            return null;
        }).catch(error => {
            if (active) {
                setState({status: 'error', error});
            }
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        if (state.status === 'loaded') {
            // The core/templates module did this after inserting the legacy Mustache output.
            requireAsync<FilterEvents>('core_filters/events').then(events => {
                if (active && root.current) {
                    events.notifyFilterContentUpdated([root.current]);
                }
                return null;
            }).catch(error => log.error(error));
        } else if (state.status === 'error') {
            requireAsync<Notification>('core/notification').then(notification => {
                if (active) {
                    return notification.exception(state.error);
                }
                return undefined;
            }).catch(error => log.error(error));
        }
        return () => {
            active = false;
        };
    }, [state]);

    useEffect(() => {
        if (expanded) {
            // The button disappears: continue keyboard navigation at the first newly revealed item.
            root.current?.querySelector<HTMLAnchorElement>('[role="listitem"]:nth-child(4) a')?.focus();
        }
    }, [expanded]);

    return (
        <div ref={root} className="block-recentlyaccesseditems block-cards" data-region="recentlyaccesseditems">
            <div className="container-fluid p-0" data-region="recentlyaccesseditems-view" aria-busy={state.status === 'loading'}>
                <div data-region="recentlyaccesseditems-view-content">
                    {state.status === 'loading' && <LoadingState label={loadinglabel} />}
                    {state.status === 'loaded' && (state.items.length === 0 ? (
                        <EmptyState noitemsimgurl={noitemsimgurl} message={noitemslabel} />
                    ) : (
                        <>
                            <div id={listId} data-region="items-list" role="list">
                                {state.items.map(item => <RecentItem key={item.id} item={item} expanded={expanded} />)}
                            </div>
                            {state.items.length > 3 && !expanded && (
                                <div data-region="more-items-button-container" className="mt-2 px-1">
                                    <Button label={moreitemslabel} variant="secondary" size="md"
                                        data-action="more-items" aria-controls={listId} onClick={() => setExpanded(true)} />
                                </div>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
