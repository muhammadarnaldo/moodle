<?php
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
 * Tests for the Recently accessed items block.
 *
 * @package    block_recentlyaccesseditems
 * @category   test
 * @copyright  2026 Muhammad Arnaldo <muhammad.arnaldo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace block_recentlyaccesseditems;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Tests for the block content and props passed to React.
 */
#[CoversClass(\block_recentlyaccesseditems::class)]
final class block_recentlyaccesseditems_test extends \advanced_testcase {
    /**
     * The mount must identify the component and pass translated labels and an unescaped image URL.
     *
     * @param bool $slasharguments Whether image URLs use slash arguments.
     */
    #[DataProvider('image_url_provider')]
    public function test_get_content_emits_react_mount(bool $slasharguments): void {
        global $CFG, $OUTPUT;
        $this->resetAfterTest();
        $this->setAdminUser();
        $CFG->slasharguments = $slasharguments;
        $OUTPUT->get_page()->set_context(\context_system::instance());
        $block = \block_instance('recentlyaccesseditems');
        $content = $block->get_content();

        $this->assertStringContainsString(
            'data-react-component="@moodle/lms/block_recentlyaccesseditems/RecentlyAccessedItems"',
            $content->text,
        );
        $this->assertSame(1, preg_match('/data-react-props="([^"]*)"/', $content->text, $matches));
        $props = json_decode(html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8'), true, 512, JSON_THROW_ON_ERROR);
        $expectedurl = $OUTPUT->image_url('items', 'block_recentlyaccesseditems')->out(false);
        $this->assertSame([
            'loadinglabel' => get_string('loading', 'core'),
            'noitemslabel' => get_string('noitems', 'block_recentlyaccesseditems'),
            'moreitemslabel' => get_string('moreitems', 'block_recentlyaccesseditems'),
            'noitemsimgurl' => $expectedurl,
        ], $props);
        if (!$slasharguments) {
            $this->assertStringContainsString('&', $props['noitemsimgurl']);
            $this->assertStringNotContainsString('&amp;', $props['noitemsimgurl']);
        }
        $this->assertSame('', $content->footer);
    }

    /**
     * Image URL configurations to verify.
     *
     * @return array
     */
    public static function image_url_provider(): array {
        return [
            'slash arguments' => [true],
            'query parameters' => [false],
        ];
    }
}
