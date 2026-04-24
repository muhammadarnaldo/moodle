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

namespace core_course;

use context_user;
use context_course;
use ReflectionMethod;
use core_cache\definition;
use core_course\cache\course_image;

/**
 * Functional test for class course_image
 *
 * @package    core
 * @subpackage course
 * @author     Dmitrii Metelkin <dmitriim@catalyst-au.net>
 * @copyright  2021 Catalyst IT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core_course\cache\course_image
 */
final class course_image_cache_test extends \advanced_testcase {

    /**
     * Initial setup.
     */
    protected function setUp(): void {
        global $CFG;

        parent::setUp();
        $this->resetAfterTest();
        $this->setAdminUser();

        // Allow multiple overview files.
        $CFG->courseoverviewfileslimit = 3;
    }

    /**
     * Helper method to create a draft area for current user and fills it with fake files
     *
     * @param array $files array of files that need to be added to filearea, filename => filecontents
     * @return int draftid for the filearea
     */
    protected function fill_draft_area(array $files): int {
        global $USER;

        $draftid = file_get_unused_draft_itemid();
        foreach ($files as $filename => $filecontents) {
            // Add actual file there.
            $filerecord = [
                'component' => 'user',
                'filearea' => 'draft',
                'contextid' => context_user::instance($USER->id)->id, 'itemid' => $draftid,
                'filename' => $filename, 'filepath' => '/'
            ];
            $fs = get_file_storage();
            $fs->create_file_from_string($filerecord, $filecontents);
        }
        return $draftid;
    }

    /**
     * A helper method to generate expected file URL.
     *
     * @param \stdClass $course Course object.
     * @param string $filename File name.
     * @param int $timemodified File timemodified timestamp for cache-busting.
     * @return string
     */
    protected function build_expected_course_image_url(\stdClass $course, string $filename, int $timemodified): string {
        $contextid = context_course::instance($course->id)->id;
        return 'https://www.example.com/moodle/pluginfile.php/' . $contextid .
            '/course/overviewfiles/' . $filename . '?oid=' . $timemodified;
    }

    /**
     * Test exception if try to get an image for non existing course.
     */
    public function test_getting_data_if_course_is_not_exist(): void {
        $this->expectException('dml_missing_record_exception');
        $this->expectExceptionMessageMatches("/Can't find data record in database table course./");
        $this->assertFalse(\cache::make('core', 'course_image')->get(999));
    }

    /**
     * Test get_image_url_from_overview_files when no summary files in the course.
     */
    public function test_get_image_url_from_overview_files_return_null_if_no_summary_files_in_the_course(): void {
        $method = new ReflectionMethod(course_image::class, 'get_image_url_from_overview_files');
        $cache = course_image::get_instance_for_cache(new definition());

        // Create course without files.
        $course = $this->getDataGenerator()->create_course();
        $this->assertNull($method->invokeArgs($cache, [$course]));
    }

    /**
     * Test get_image_url_from_overview_files when no summary images in the course.
     */
    public function test_get_image_url_from_overview_files_returns_null_if_no_summary_images_in_the_course(): void {
        $method = new ReflectionMethod(course_image::class, 'get_image_url_from_overview_files');
        $cache = course_image::get_instance_for_cache(new definition());

        // Create course without image files.
        $draftid2 = $this->fill_draft_area(['filename2.zip' => 'Test file contents2']);
        $course2 = $this->getDataGenerator()->create_course(['overviewfiles_filemanager' => $draftid2]);
        $this->assertNull($method->invokeArgs($cache, [$course2]));
    }

    /**
     * Test get_image_url_from_overview_files when no summary images in the course.
     */
    public function test_get_image_url_from_overview_files_returns_url_if_there_is_a_summary_image(): void {
        $method = new ReflectionMethod(course_image::class, 'get_image_url_from_overview_files');
        $cache = course_image::get_instance_for_cache(new definition());

        // Create course without one image.
        $draftid1 = $this->fill_draft_area([
            'filename1.jpg' => file_get_contents(self::get_fixture_path(__NAMESPACE__, 'image.jpg')),
        ]);
        $course1 = $this->getDataGenerator()->create_course(['overviewfiles_filemanager' => $draftid1]);
        $contextid = context_course::instance($course1->id)->id;
        $file = get_file_storage()->get_file($contextid, 'course', 'overviewfiles', 0, '/', 'filename1.jpg');
        $expected = $this->build_expected_course_image_url($course1, 'filename1.jpg', $file->get_timemodified());
        $this->assertEquals($expected, $method->invokeArgs($cache, [$course1]));
    }

    /**
     * Test get_image_url_from_overview_files when several summary images in the course.
     */
    public function test_get_image_url_from_overview_files_returns_url_of_the_first_image_if_there_are_many_summary_images(): void {
        $method = new ReflectionMethod(course_image::class, 'get_image_url_from_overview_files');
        $cache = course_image::get_instance_for_cache(new definition());

        // Create course with two image files.
        $draftid1 = $this->fill_draft_area([
            'filename1.jpg' => file_get_contents(self::get_fixture_path(__NAMESPACE__, 'image.jpg')),
            'filename2.jpg' => file_get_contents(self::get_fixture_path(__NAMESPACE__, 'image.jpg')),
        ]);
        $course1 = $this->getDataGenerator()->create_course(['overviewfiles_filemanager' => $draftid1]);
        $contextid = context_course::instance($course1->id)->id;
        $file = get_file_storage()->get_file($contextid, 'course', 'overviewfiles', 0, '/', 'filename1.jpg');
        $expected = $this->build_expected_course_image_url($course1, 'filename1.jpg', $file->get_timemodified());
        $this->assertEquals($expected, $method->invokeArgs($cache, [$course1]));
    }

    /**
     * Test get_image_url_from_overview_files when several summary files in the course.
     */
    public function test_get_image_url_from_overview_files_returns_url_of_the_first_image_if_there_are_many_summary_files(): void {
        $method = new ReflectionMethod(course_image::class, 'get_image_url_from_overview_files');
        $cache = course_image::get_instance_for_cache(new definition());

        // Create course with two image files and one zip file.
        $draftid1 = $this->fill_draft_area([
            'filename1.zip' => 'Test file contents2',
            'filename2.jpg' => file_get_contents(self::get_fixture_path(__NAMESPACE__, 'image.jpg')),
            'filename3.jpg' => file_get_contents(self::get_fixture_path(__NAMESPACE__, 'image.jpg')),
        ]);
        $course1 = $this->getDataGenerator()->create_course(['overviewfiles_filemanager' => $draftid1]);
        $contextid = context_course::instance($course1->id)->id;
        $file = get_file_storage()->get_file($contextid, 'course', 'overviewfiles', 0, '/', 'filename2.jpg');
        $expected = $this->build_expected_course_image_url($course1, 'filename2.jpg', $file->get_timemodified());
        $this->assertEquals($expected, $method->invokeArgs($cache, [$course1]));
    }

    /**
     * Test that replacing a course image with a file of the same name produces a different URL.
     */
    public function test_get_image_url_changes_when_file_replaced_with_same_name(): void {
        $method = new ReflectionMethod(course_image::class, 'get_image_url_from_overview_files');
        $cache = course_image::get_instance_for_cache(new definition());
        $imagecontent = file_get_contents(self::get_fixture_path(__NAMESPACE__, 'image.jpg'));

        // Create course with initial image.
        $draftid = $this->fill_draft_area(['image.jpg' => $imagecontent]);
        $course = $this->getDataGenerator()->create_course(['overviewfiles_filemanager' => $draftid]);

        $contextid = context_course::instance($course->id)->id;
        $fs = get_file_storage();
        $originalfile = $fs->get_file($contextid, 'course', 'overviewfiles', 0, '/', 'image.jpg');
        $url1 = $method->invokeArgs($cache, [$course])->out_as_local_url();

        // Simulate file replacement with same name: delete original, re-create with a later timemodified.
        $newrecord = [
            'contextid'   => $contextid,
            'component'   => 'course',
            'filearea'    => 'overviewfiles',
            'itemid'      => 0,
            'filepath'    => '/',
            'filename'    => 'image.jpg',
            'timemodified' => $originalfile->get_timemodified() + 1,
        ];
        $originalfile->delete();
        $fs->create_file_from_string($newrecord, $imagecontent);

        $url2 = $method->invokeArgs($cache, [$course])->out_as_local_url();

        $this->assertNotEquals($url1, $url2, 'URL must change when course image is replaced with a file of the same name.');
    }
}
