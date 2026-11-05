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
 * A card for a recently accessed activity or resource.
 *
 * @module     block_recentlyaccesseditems/RecentItem
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import type {RecentItemData} from '@moodle/lms/block_recentlyaccesseditems/types';

/** Props for a recent item card. */
export interface Props {
    /** Item returned by the existing web service. */
    item: RecentItemData;
    /** Whether Show more has revealed the cards hidden by the sidebar CSS. */
    expanded: boolean;
}

/**
 * Render a card using the existing block's markup and server-formatted content.
 *
 * The exporter formats and cleans name/coursename through core\external\exporter::export().
 * The icon comes from Moodle's activity icon renderer, including custom plugin icons.
 * These HTML fields must not be replaced with unprocessed user input.
 *
 * @param props Component props.
 * @param props.item The recent item to display.
 * @param props.expanded Whether to reveal cards hidden in the sidebar.
 * @returns A recent item card.
 */
export default function RecentItem({item, expanded}: Props) {
    // A title attribute needs decoded plain text, rather than the formatted name's HTML.
    const title = new DOMParser().parseFromString(item.name, 'text/html').body.textContent ?? '';

    return (
        <div className="card mb-1" role="listitem" style={expanded ? {display: 'block'} : undefined}>
            <a href={item.viewurl} title={title}>
                <div className="card-body p-2 m-1">
                    <div className="d-flex text-truncate">
                        <div className="d-flex align-self-center activityiconcontainer"
                            dangerouslySetInnerHTML={{__html: item.icon}}
                        />
                        <div className="w-100 line-height-3 text-truncate ms-2">
                            <h4 className="mb-0 text-truncate h6">
                                <span className="clickable" dangerouslySetInnerHTML={{__html: item.name}} />
                            </h4>
                            <small className="text-truncate mb-0" dangerouslySetInnerHTML={{__html: item.coursename}} />
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}
