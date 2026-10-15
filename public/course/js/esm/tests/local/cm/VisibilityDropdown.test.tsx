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
 * Tests for core_course/local/cm/VisibilityDropdown.
 *
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {cloneElement, forwardRef, type ReactElement, type ReactNode, type Ref} from 'react';
import {act, fireEvent, render} from '@testing-library/react';
import VisibilityDropdown from '@moodle/lms/core_course/local/cm/VisibilityDropdown';

// Mock the ESM-only design system for the CommonJS test bundle.
jest.mock('@moodlehq/design-system', () => ({
    Dropdown: forwardRef(({trigger, open, onOpenChange, children}: {
        trigger: ReactElement<{onClick?: () => void}>;
        open: boolean;
        onOpenChange: (open: boolean) => void;
        children: ReactNode;
    }, ref: Ref<HTMLDivElement>) => (
        <div ref={ref}>
            {cloneElement(trigger, {onClick: () => onOpenChange(!open), 'aria-expanded': open} as object)}
            {open && <div role="menu">{children}</div>}
        </div>
    )),
    DropdownItemSelect: forwardRef<HTMLButtonElement, {
        label: string;
        description?: string;
        selected?: boolean;
        startIcon?: ReactElement;
        [key: string]: unknown;
    }>(({label, selected, startIcon, description, ...rest}, ref) => (
        <button ref={ref} type="button" role="menuitemradio" aria-checked={selected} {...rest}>
            {startIcon}{label}{description}
        </button>
    )),
}), {virtual: true});

const dispatch = jest.fn(() => Promise.resolve());

const PROPS = {
    cmid: 42,
    state: 'hide',
    label: 'Hidden',
    accessiblename: 'Availability: Hidden from students',
    icon: '<i class="icon fa fa-eye-slash"></i>',
    options: [
        {value: 'show', label: 'Show on course page', description: 'Available', icon: '', action: 'cmShow', selected: false},
        {value: 'hide', label: 'Hide on course page', description: 'Not available', icon: '', action: 'cmHide', selected: true},
        {value: 'stealth', label: 'Make available', description: 'With a link', icon: '', action: 'cmStealth', selected: false},
    ],
};

/**
 * Flush the promise chain started when an option is selected.
 */
const flushPromises = async() => {
    await act(async() => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

describe('core_course/local/cm/VisibilityDropdown', () => {
    beforeEach(() => {
        dispatch.mockClear();
        mockAmdModule('core_courseformat/courseeditor', {
            getCurrentCourseEditor: () => ({dispatch}),
        });
    });

    it('names the trigger with the feature and the value, and hides the label from assistive technology', () => {
        const {getByRole, getByText} = render(<VisibilityDropdown {...PROPS} />);

        const trigger = getByRole('button', {name: PROPS.accessiblename});
        expect(trigger).toHaveAttribute('data-visibility', 'hide');
        expect(getByText(PROPS.label)).toHaveAttribute('aria-hidden', 'true');
    });

    it('reports which option is selected', () => {
        const {getByRole, getAllByRole} = render(<VisibilityDropdown {...PROPS} />);

        fireEvent.click(getByRole('button', {name: PROPS.accessiblename}));

        const checked = getAllByRole('menuitemradio').map((item) => item.getAttribute('aria-checked'));
        expect(checked).toEqual(['false', 'true', 'false']);
    });

    it('dispatches the option mutation for the course module and closes the menu', async() => {
        const {getByRole, queryByRole} = render(<VisibilityDropdown {...PROPS} />);

        fireEvent.click(getByRole('button', {name: PROPS.accessiblename}));
        fireEvent.click(getByRole('menuitemradio', {name: /Show on course page/}));
        await flushPromises();

        expect(dispatch).toHaveBeenCalledWith('cmShow', [42]);
        expect(queryByRole('menu')).toBeNull();
        expect(getByRole('button', {name: PROPS.accessiblename})).toHaveFocus();
    });

    it('dispatches the current value again so the change is announced', async() => {
        const {getByRole} = render(<VisibilityDropdown {...PROPS} />);

        fireEvent.click(getByRole('button', {name: PROPS.accessiblename}));
        fireEvent.click(getByRole('menuitemradio', {name: /Hide on course page/}));
        await flushPromises();

        expect(dispatch).toHaveBeenCalledWith('cmHide', [42]);
    });

    it('returns the focus to the reloaded dropdown after a value change', async() => {
        const {getByRole, unmount} = render(<VisibilityDropdown {...PROPS} />);

        fireEvent.click(getByRole('button', {name: PROPS.accessiblename}));
        fireEvent.click(getByRole('menuitemradio', {name: /Show on course page/}));
        await flushPromises();
        unmount();
        (document.activeElement as HTMLElement | null)?.blur();

        const reloaded = render(
            <VisibilityDropdown {...PROPS} state="show" label="Visible" accessiblename="Availability: Visible on course page" />
        );

        expect(reloaded.getByRole('button', {name: 'Availability: Visible on course page'})).toHaveFocus();
    });

    it('wraps Up and Down at the ends of the menu', () => {
        const {getByRole, getAllByRole} = render(<VisibilityDropdown {...PROPS} />);

        fireEvent.click(getByRole('button', {name: PROPS.accessiblename}));
        const items = getAllByRole('menuitemradio');

        items[2].focus();
        fireEvent.keyDown(items[2], {key: 'ArrowDown'});
        expect(items[0]).toHaveFocus();

        fireEvent.keyDown(items[0], {key: 'ArrowUp'});
        expect(items[2]).toHaveFocus();
    });

    it('closes on Tab and returns the focus to the dropdown', () => {
        const {getByRole, getAllByRole, queryByRole} = render(<VisibilityDropdown {...PROPS} />);

        fireEvent.click(getByRole('button', {name: PROPS.accessiblename}));
        const items = getAllByRole('menuitemradio');
        items[0].focus();
        fireEvent.keyDown(items[0], {key: 'Tab'});

        expect(queryByRole('menu')).toBeNull();
        expect(getByRole('button', {name: PROPS.accessiblename})).toHaveFocus();
    });
});
