<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    private const FRONTEND_URL = 'http://localhost:3000';

    public function test_store_入力値が有効な場合_ユーザーを登録しセッションcookieで認証状態を維持できること(): void
    {
        $this->withHeader('Origin', self::FRONTEND_URL)
            ->get('/sanctum/csrf-cookie')
            ->assertNoContent();

        $originalSessionId = $this->app['session']->getId();

        $response = $this
            ->withCredentials()
            ->withCookie(config('session.cookie'), $originalSessionId)
            ->postJson('/api/register', [
                'name' => '  Test User  ',
                'email' => '  USER@Example.COM  ',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response
            ->assertCreated()
            ->assertExactJson([
                'data' => [
                    'id' => 1,
                    'name' => 'Test User',
                    'email' => 'user@example.com',
                ],
            ]);

        $user = User::query()->sole();
        $authenticatedSessionId = $this->app['session']->getId();

        $this->assertNotSame($originalSessionId, $authenticatedSessionId);
        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertAuthenticatedAs($user);

        $this->app['auth']->forgetGuards();

        $this
            ->withCookie(config('session.cookie'), $authenticatedSessionId)
            ->getJson('/api/v1/user')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_store_入力値が不正な場合_バリデーションエラーになること(): void
    {
        $response = $this
            ->withHeader('Origin', self::FRONTEND_URL)
            ->postJson('/api/register', [
                'name' => '   ',
                'email' => 'invalid-email',
                'password' => 'short',
                'password_confirmation' => 'different',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);

        $this->assertDatabaseEmpty('users');
        $this->assertGuest();
    }

    public function test_store_正規化後のメールアドレスが重複する場合_バリデーションエラーになること(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
        ]);

        $response = $this
            ->withHeader('Origin', self::FRONTEND_URL)
            ->postJson('/api/register', [
                'name' => 'Another User',
                'email' => '  USER@EXAMPLE.COM ',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('users', 1);
        $this->assertGuest();
    }
}
