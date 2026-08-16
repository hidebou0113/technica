<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticatedSessionTest extends TestCase
{
    use RefreshDatabase;

    private const FRONTEND_URL = 'http://localhost:3000';

    public function test_csrf_cookie_spaからリクエストした場合_csrfとセッションcookieが発行されること(): void
    {
        $this
            ->withHeader('Origin', self::FRONTEND_URL)
            ->get('/sanctum/csrf-cookie')
            ->assertNoContent()
            ->assertCookie('XSRF-TOKEN')
            ->assertCookie(config('session.cookie'));
    }

    public function test_store_認証情報が正しい場合_ログインしセッションcookieで認証状態を維持できること(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
        ]);

        $originalSessionId = $this->initializeSession();

        $response = $this
            ->withCookie(config('session.cookie'), $originalSessionId)
            ->postJson('/api/login', [
                'email' => '  USER@Example.COM ',
                'password' => 'password123',
            ]);

        $response
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => 'user@example.com',
                ],
            ]);

        $authenticatedSessionId = $this->app['session']->getId();

        $this->assertNotSame($originalSessionId, $authenticatedSessionId);
        $this->assertAuthenticatedAs($user);

        $this->app['auth']->forgetGuards();

        $this
            ->withCookie(config('session.cookie'), $authenticatedSessionId)
            ->getJson('/api/v1/user')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_store_認証情報が誤っている場合_バリデーションエラーになること(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this
            ->withHeader('Origin', self::FRONTEND_URL)
            ->postJson('/api/login', [
                'email' => 'user@example.com',
                'password' => 'incorrect-password',
            ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    public function test_store_メールアドレスとパスワードが未入力の場合_バリデーションエラーになること(): void
    {
        $response = $this
            ->withHeader('Origin', self::FRONTEND_URL)
            ->postJson('/api/login', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);

        $this->assertGuest();
    }

    public function test_destroy_ログイン中の場合_ログアウトし以前のセッションが無効になること(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
        ]);

        $originalSessionId = $this->initializeSession();

        $this
            ->withCookie(config('session.cookie'), $originalSessionId)
            ->postJson('/api/login', [
                'email' => 'user@example.com',
                'password' => 'password123',
            ])
            ->assertOk();

        $authenticatedSessionId = $this->app['session']->getId();

        $this->app['auth']->forgetGuards();

        $this
            ->withCookie(config('session.cookie'), $authenticatedSessionId)
            ->postJson('/api/logout')
            ->assertNoContent();

        $guestSessionId = $this->app['session']->getId();

        $this->assertNotSame($authenticatedSessionId, $guestSessionId);
        $this->app['auth']->forgetGuards();
        $this->assertGuest();

        $this
            ->withCookie(config('session.cookie'), $authenticatedSessionId)
            ->getJson('/api/v1/user')
            ->assertUnauthorized();
    }

    public function test_destroy_未認証の場合_認証エラーになること(): void
    {
        $this
            ->withHeader('Origin', self::FRONTEND_URL)
            ->postJson('/api/logout')
            ->assertUnauthorized();
    }

    private function initializeSession(): string
    {
        $this
            ->withCredentials()
            ->withHeader('Origin', self::FRONTEND_URL)
            ->get('/sanctum/csrf-cookie')
            ->assertNoContent();

        return $this->app['session']->getId();
    }
}
