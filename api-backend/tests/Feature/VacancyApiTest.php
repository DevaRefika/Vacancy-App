// tests/Feature/VacancyApiTest.php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Vacancy;

class VacancyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_all_vacancies()
    {
        $user = User::factory()->create();
        Vacancy::factory()->create(['judul' => 'Laravel Developer']);

        $response = $this->actingAs($user)
                         ->getJson('/api/Vacancy/all');

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'vacancy'])
                 ->assertJsonFragment(['judul' => 'Laravel Developer']);
    }
}