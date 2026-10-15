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
 * Activity visibility dropdown displayed on every activity card in edit mode.
 *
 * @module     core_course/local/cm/VisibilityDropdown
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {Dropdown, DropdownItemSelect} from '@moodlehq/design-system';
import {requireAsync} from '@moodle/lms/core/amd';
import Pending from '@moodle/lms/core/pending';

export interface VisibilityOption {
    /** The choice value (show, hide or stealth). */
    value: string;
    label: string;
    description: string;
    /** The rendered option icon HTML. */
    icon: string;
    /** The course editor mutation that applies the option. */
    action: string;
    selected: boolean;
}

export interface VisibilityDropdownProps {
    cmid: number;
    /** The current visibility state (show, hide or stealth). */
    state: string;
    label: string;
    /** The trigger accessible name. It always contains the visible label. */
    accessiblename: string;
    /** The rendered state icon HTML. */
    icon: string;
    options: VisibilityOption[];
}

type CourseEditor = {
    dispatch: (actionName: string, ...params: unknown[]) => Promise<void>;
};

type CourseEditorModule = {
    getCurrentCourseEditor: () => CourseEditor;
};

/**
 * Preserve focus across component remounts when a visibility change reloads the activity card.
 */
const pendingFocus = new Set<number>();

/**
 * Render the activity visibility dropdown.
 *
 * @param props Component props.
 * @returns The rendered dropdown.
 */
export default function VisibilityDropdown({cmid, state, label, accessiblename, icon, options}: VisibilityDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // A trigger ref would replace the ref Dropdown needs to position the menu.
    const getTrigger = () => dropdownRef.current?.querySelector<HTMLButtonElement>('.activity-visibility-trigger');

    useEffect(() => {
        if (pendingFocus.delete(cmid)) {
            getTrigger()?.focus();
        }
    }, [cmid]);

    // Focus the selected item after the Dropdown focuses its first item in an animation frame.
    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const selectedIndex = options.findIndex((option) => option.selected);
        if (selectedIndex <= 0) {
            return undefined;
        }
        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => itemRefs.current[selectedIndex]?.focus());
        });
        return () => cancelAnimationFrame(frame);
    }, [open, options]);

    const closeMenu = () => {
        setOpen(false);
        getTrigger()?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            closeMenu();
            return;
        }
        const items = itemRefs.current.filter((item): item is HTMLButtonElement => item !== null);
        const current = items.indexOf(document.activeElement as HTMLButtonElement);
        let wrapTo: HTMLButtonElement | null = null;
        if (event.key === 'ArrowDown' && current === items.length - 1) {
            wrapTo = items[0];
        } else if (event.key === 'ArrowUp' && current === 0) {
            wrapTo = items[items.length - 1];
        }
        if (wrapTo) {
            // Stop the Dropdown list navigation, which does not loop.
            event.preventDefault();
            event.stopPropagation();
            wrapTo.focus();
        }
    };

    const selectOption = (option: VisibilityOption) => {
        closeMenu();
        if (!option.action) {
            return;
        }
        // Selecting the current value does not reload the card, but it is still dispatched so the
        // course editor announces the value again.
        if (!option.selected) {
            pendingFocus.add(cmid);
        }
        const pending = new Pending(`core_course/VisibilityDropdown:${cmid}`);
        requireAsync<CourseEditorModule>('core_courseformat/courseeditor').then((courseEditor) => {
            return courseEditor.getCurrentCourseEditor().dispatch(option.action, [cmid]);
        }).catch(() => {
            pendingFocus.delete(cmid);
        }).finally(() => {
            pending.resolve();
        });
    };

    // A custom trigger allows an accessible name different from the visible label.
    const trigger = (
        <button
            type="button"
            className={[
                'mds-btn btn btn-outline-secondary mds-btn--size-md mds-dropdown-trigger activity-visibility-trigger',
                open ? 'mds-dropdown-trigger--open' : '',
            ].join(' ').trim()}
            data-visibility={state}
        >
            <span className="activity-visibility-icon" aria-hidden="true" dangerouslySetInnerHTML={{__html: icon}} />
            <span className="activity-visibility-label" aria-hidden="true">{label}</span>
            <span className="visually-hidden">{accessiblename}</span>
            <i className="mds-dropdown-trigger__chevron" aria-hidden="true" />
        </button>
    );

    return (
        <Dropdown ref={dropdownRef} trigger={trigger} open={open} onOpenChange={setOpen}>
            <div role="none" className="activity-visibility-menu" onKeyDown={handleKeyDown}>
                {options.map((option, index) => (
                    <DropdownItemSelect
                        key={option.value}
                        ref={(element) => {
                            itemRefs.current[index] = element;
                        }}
                        label={option.label}
                        description={option.description}
                        selected={option.selected}
                        startIcon={
                            <i
                                className="activity-visibility-option-icon"
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{__html: option.icon}}
                            />
                        }
                        data-value={option.value}
                        onClick={() => selectOption(option)}
                    />
                ))}
            </div>
        </Dropdown>
    );
}
