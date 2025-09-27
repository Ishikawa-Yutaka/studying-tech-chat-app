'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

import { userOperations } from '@/lib/db';

export async function signup(formData: FormData) {
  console.log('signup関数開始');
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: { data: { name: formData.get('name') as string } },
  };

  console.log('サインアップデータ:', { email: data.email, name: data.options.data.name });

  // 開発環境ではメール確認をスキップ
  const { data: authData, error } = await supabase.auth.signUp({
    ...data,
    options: {
      ...data.options,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/workspace`,
      // 開発環境では自動確認
      skipConfirmation: process.env.NODE_ENV === 'development'
    }
  });

  if (error) {
    console.error('Supabaseサインアップエラー:', error);
    // ユーザーが既に存在する場合
    if (error.message?.includes('user_already_exists') || 
        error.message?.includes('User already registered') ||
        ('code' in error && error.code === 'user_already_exists')) {
      redirect('/signup?error=' + encodeURIComponent('このメールアドレスは既に登録されています。別のメールアドレスをお使いください。'));
    }
    // その他のエラー
    redirect('/error');
  }

  console.log('Supabaseサインアップ成功:', authData);

  // signUpのレスポンスから直接ユーザー情報を取得
  const user = authData.user;

  if (!user || !user.id) {
    console.error('ユーザー情報が取得できませんでした');
    redirect('/error');
  }

  console.log('ユーザー情報:', { id: user.id, email: user.email });

  try {
    console.log('データベース保存開始');
    const dbUser = await userOperations.createUser(user.id, data.email, data.options.data.name);
    console.log('データベース保存成功:', dbUser);
  } catch (dbError: unknown) {
    console.error('データベース保存エラー:', dbError);
    // 重複エラー（P2002）の場合はユーザーに適切なメッセージを表示
    if (dbError && typeof dbError === 'object' && 'code' in dbError && dbError.code === 'P2002') {
      redirect('/signup?error=' + encodeURIComponent('このメールアドレスは既に登録されています。別のメールアドレスをお使いください。'));
    } else {
      // その他のデータベースエラー
      redirect('/signup?error=' + encodeURIComponent('アカウント作成中にエラーが発生しました。もう一度お試しください。'));
    }
  }

  // signUpの後に自動的にサインインを実行してセッションを確立
  console.log('自動サインイン開始');
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (signInError) {
    console.error('自動サインインエラー:', signInError);
    // メール確認が必要な場合は、確認メッセージを表示してログインページへ
    if (signInError.message?.includes('email_not_confirmed') || signInError.message?.includes('Email not confirmed')) {
      redirect('/login?message=' + encodeURIComponent('メール認証が必要です。メールをご確認ください。'));
    }
    // その他のエラーの場合もログインページへ
    redirect('/login');
  }

  console.log('自動サインイン成功');

  revalidatePath('/', 'layout');
  console.log('workspaceにリダイレクト');
  redirect('/workspace');
}
