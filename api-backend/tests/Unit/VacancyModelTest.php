// tests/Unit/VacancyModelTest.php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\Vacancy;

class VacancyModelTest extends TestCase
{
    public function test_vacancy_has_valid_attributes()
    {
        $vacancy = new Vacancy([
            'judul' => 'Software Engineer',
            'tipe_pekerjaan' => 'Full-time'
        ]);

        $this->assertEquals('Software Engineer', $vacancy->judul);
        $this->assertEquals('Full-time', $vacancy->tipe_pekerjaan);
    }
}