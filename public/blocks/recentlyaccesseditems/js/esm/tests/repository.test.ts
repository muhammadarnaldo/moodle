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
 * Tests for the existing recent-items web service contract.
 *
 * @module     block_recentlyaccesseditems/tests/repository
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {fetchOne} from '@moodle/lms/core/ajax';
import {getRecentItems} from '../src/repository';

it('uses the existing service with the requested limit and preserves its response', async() => {
    const response = [{id: 42, name: 'Forum'}];
    jest.mocked(fetchOne).mockResolvedValue(response);

    await expect(getRecentItems(9)).resolves.toBe(response);
    expect(fetchOne).toHaveBeenCalledWith({
        methodname: 'block_recentlyaccesseditems_get_recent_items',
        args: {limit: 9},
    });
});

it('propagates failure instead of treating it as an empty history', async() => {
    const error = new Error('Service unavailable');
    jest.mocked(fetchOne).mockRejectedValue(error);
    await expect(getRecentItems(9)).rejects.toBe(error);
});
