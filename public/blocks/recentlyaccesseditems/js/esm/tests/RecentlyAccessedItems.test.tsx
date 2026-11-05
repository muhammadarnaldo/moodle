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
 * Tests for loading, empty, error and expanded states of the block.
 *
 * @module     block_recentlyaccesseditems/tests/RecentlyAccessedItems
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {act, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import type {ButtonHTMLAttributes} from 'react';
import RecentlyAccessedItems from '../src/RecentlyAccessedItems';
import {getRecentItems} from '../src/repository';
import type {RecentItemData} from '../src/types';

jest.mock('../src/repository', () => ({getRecentItems: jest.fn()}));
// Test state and accessibility with a native button; exercise the real MDS component in the browser.
jest.mock('@moodlehq/design-system', () => ({
    Button: ({label, variant: _variant, size: _size, ...props}:
        ButtonHTMLAttributes<HTMLButtonElement> & {label: string; variant: string; size: string}) =>
        <button {...props}>{label}</button>,
}), {virtual: true});

const getItems = jest.mocked(getRecentItems);
const notifyFilters = jest.fn();
const notifyException = jest.fn();

/** Create service items in a predictable order. */
const items = (count: number): RecentItemData[] => Array.from({length: count}, (_, index) => ({
    id: index + 1,
    name: `Activity ${index + 1}`,
    coursename: 'Course',
    icon: '<img src="/icon.svg" alt="">',
    viewurl: `/mod/forum/view.php?id=${index + 1}`,
}));

beforeEach(() => {
    mockAmdModule('core_filters/events', {notifyFilterContentUpdated: notifyFilters});
    mockAmdModule('core/notification', {exception: notifyException});
});

/** Flush request effects before asserting the rendered state. */
async function renderBlock(noitemsimgurl = '/empty.svg') {
    let result!: ReturnType<typeof render>;
    await act(async() => {
        result = render(<RecentlyAccessedItems noitemsimgurl={noitemsimgurl}
            loadinglabel="Loading" noitemslabel="No recent items" moreitemslabel="Show more items" />);
    });
    return result;
}

it('shows a loading status while the data request is pending', async() => {
    getItems.mockReturnValue(new Promise(() => { /* Keep the request pending. */ }));
    await renderBlock();
    expect(await screen.findByRole('status')).toHaveTextContent('Loading');
    expect(screen.queryByText('No recent items')).not.toBeInTheDocument();
    expect(getItems).toHaveBeenCalledWith(9);
});

it('shows the translated empty state only after a successful empty response', async() => {
    getItems.mockResolvedValue([]);
    const {container} = await renderBlock('/empty.svg?x=1&y=2');
    expect(await screen.findByText('No recent items')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', '/empty.svg?x=1&y=2');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await waitFor(() => expect(notifyFilters).toHaveBeenCalledTimes(1));
    expect(notifyFilters.mock.calls[0][0][0]).toBe(container.firstChild);
});

it.each([1, 3])('does not offer Show more for %i items', async count => {
    getItems.mockResolvedValue(items(count));
    await renderBlock();
    expect(await screen.findAllByRole('listitem')).toHaveLength(count);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it.each([4, 9])('reveals all %i loaded cards without another request and moves focus to the fourth link', async count => {
    getItems.mockResolvedValue(items(count));
    await renderBlock();
    const button = await screen.findByRole('button', {name: 'Show more items'});
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(count);
    button.focus();
    await act(async() => {
        fireEvent.click(button);
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    for (const card of cards) {
        expect(card).toHaveStyle({display: 'block'});
    }
    expect(within(cards[3]).getByRole('link')).toHaveFocus();
    expect(getItems).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(notifyFilters).toHaveBeenCalledTimes(1));
});

it('reports service errors without rendering an empty history', async() => {
    const error = new Error('Request failed');
    getItems.mockRejectedValue(error);
    await renderBlock();
    await waitFor(() => expect(notifyException).toHaveBeenCalledWith(error));
    expect(screen.queryByText('No recent items')).not.toBeInTheDocument();
    expect(notifyFilters).not.toHaveBeenCalled();
});

it('ignores a response which arrives after the block was unmounted', async() => {
    let resolveRequest!: (value: RecentItemData[]) => void;
    getItems.mockReturnValue(new Promise(resolve => {
        resolveRequest = resolve;
    }));
    const {unmount} = await renderBlock();
    unmount();
    await act(async() => {
        resolveRequest(items(4));
    });
    expect(notifyFilters).not.toHaveBeenCalled();
    expect(notifyException).not.toHaveBeenCalled();
});

it('expands only the selected instance when two blocks are mounted', async() => {
    getItems.mockResolvedValue(items(4));
    const first = await renderBlock('/first.svg');
    const second = await renderBlock('/second.svg');
    const button = await within(second.container).findByRole('button', {name: 'Show more items'});
    await act(async() => {
        fireEvent.click(button);
    });
    expect(await within(first.container).findByRole('button', {name: 'Show more items'})).toBeInTheDocument();
    expect(within(first.container).getAllByRole('listitem')[3].style.display).toBe('');
    expect(within(second.container).getAllByRole('listitem')[3]).toHaveStyle({display: 'block'});
});
