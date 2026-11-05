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
 * Empty state for the Recently accessed items block.
 *
 * @module     block_recentlyaccesseditems/EmptyState
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** Props for the empty state component. */
export interface Props {
    /** URL of the illustration displayed when there are no recently accessed items. */
    noitemsimgurl: string;
    /** Translated empty state message. */
    message: string;
}

/**
 * Render the illustration and translated message when there are no recently accessed items.
 *
 * @param props Component props.
 * @param props.noitemsimgurl URL of the empty state illustration.
 * @param props.message Translated message.
 * @returns The empty state content.
 */
export default function EmptyState({noitemsimgurl, message}: Props) {
    return (
        <div className="text-xs-center text-center mt-4" data-region="empty-message">
            <img
                src={noitemsimgurl}
                alt=""
                style={{height: '70px', width: '70px'}}
            />
            <p className="text-muted mt-3 mb-0">
                {message}
            </p>
        </div>
    );
}
