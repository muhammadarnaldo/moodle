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
 * Tests for server-formatted activity cards.
 *
 * @module     block_recentlyaccesseditems/tests/RecentItem
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen} from '@testing-library/react';
import RecentItem from '../src/RecentItem';

it('preserves formatted names and plugin icon HTML while using plain text for the title', () => {
    render(<RecentItem expanded={false} item={{
        id: 42,
        name: '<span lang="en">A &amp; B "discussion"</span>',
        coursename: '<span lang="en">Course &amp; more</span>',
        viewurl: '/mod/forum/view.php?id=42&mode=1',
        icon: '<img src="/plugin-icon.svg" alt="" data-region="activity-icon">',
    }} />);

    const link = screen.getByRole('link', {name: 'A & B "discussion" Course & more'});
    expect(link).toHaveAttribute('title', 'A & B "discussion"');
    expect(link).toHaveAttribute('href', '/mod/forum/view.php?id=42&mode=1');
    expect(link.querySelector('span[lang="en"]')).not.toBeNull();
    expect(link.querySelector('img')).toHaveAttribute('src', '/plugin-icon.svg');
    expect(screen.getByRole('listitem').style.display).toBe('');
});
