import { test, expect } from '@playwright/test';

const YOUR_EMAIL = process.env.YOUR_EMAIL || '';
const YOUR_PASSWORD = process.env.YOUR_PASSWORD || '';

test('トップページが正しく表示される', async ({ page }) => {
  // トップページにアクセス
  await page.goto('/');

  // ヘッダーにアプリ名が表示されていることを確認
  await expect(page.locator('header', { hasText: 'STUDYing Tech Chat' })).toBeVisible();

  // ログインと新規登録ボタンが表示されていることを確認
  await expect(page.getByRole('link', { name: 'ログイン' })).toBeVisible();
  await expect(page.getByRole('link', { name: '新規登録' })).toBeVisible();

  // 主な機能セクションが表示されていることを確認
  await expect(page.getByRole('heading', { name: '主な機能' })).toBeVisible();
  await expect(page.getByText('チャンネル機能')).toBeVisible();
  await expect(page.getByText('ダイレクトメッセージ')).toBeVisible();
  await expect(page.getByText('AI機能')).toBeVisible();
});

test('ログイン機能', async ({ page }) => {
  // ログインページにアクセス
  await page.goto('/login');

  // ログインフォームが表示されていることを確認
  await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();

  // テスト用のユーザー情報を入力
  await page.getByLabel('メールアドレス').fill(YOUR_EMAIL);
  await page.getByLabel('パスワード').fill(YOUR_PASSWORD);

  // ログインボタンをクリック
  await page.getByRole('button', { name: 'ログイン' }).click();

  // リダイレクトを待つ （タイムアウトを 10 秒に設定）
  await page.waitForURL('/workspace', { timeout: 10000 });

  // ワークスペースページにリダイレクトされることを確認
  await expect(page).toHaveURL('/workspace');
  await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
});
