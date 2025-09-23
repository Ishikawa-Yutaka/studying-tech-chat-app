// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// TODO: ご自身の Supabase のユーザー ID をコピペしてください
const MY_USER_ID = 'cmfueced50000j04e1x8j9xtp';

async function main() {
  /**
   * ユーザーデータの作成
   *
   * @note authId は適当。ユニーク制約に引っかからないようにしている
   */
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: '田中 一郎',
        email: 'tanaka@example.com',
        authId: 'auth0|2',
      },
    }),
    prisma.user.create({
      data: { name: '佐藤 次郎', email: 'sato@example.com', authId: 'auth0|3' },
    }),
    prisma.user.create({
      data: {
        name: '鈴木 三郎',
        email: 'suzuki@example.com',
        authId: 'auth0|4',
      },
    }),
    prisma.user.create({
      data: {
        name: '山田 四郎',
        email: 'yamada@example.com',
        authId: 'auth0|5',
      },
    }),
    prisma.user.create({
      data: {
        name: '小林 五郎',
        email: 'kobayashi@example.com',
        authId: 'auth0|6',
      },
    }),
    prisma.user.create({
      data: {
        name: '松本 六郎',
        email: 'matsumoto@example.com',
        authId: 'auth0|7',
      },
    }),
    prisma.user.create({
      data: {
        name: '渡辺 七郎',
        email: 'watanabe@example.com',
        authId: 'auth0|8',
      },
    }),
    prisma.user.create({
      data: {
        name: '中村 八郎',
        email: 'nakamura@example.com',
        authId: 'auth0|9',
      },
    }),
    prisma.user.create({
      data: {
        name: '高橋 九郎',
        email: 'takahashi@example.com',
        authId: 'auth0|10',
      },
    }),
  ]);
  console.log(`${users.length} 人のユーザーを作成しました`);

  /**
   * チャンネルの作成
   */
  const channels = await Promise.all([
    prisma.channel.create({
      data: {
        name: '一般',
        description: '全体的な議論のためのチャンネルです',
        type: 'channel',
      },
    }),
    prisma.channel.create({
      data: {
        name: 'ランダム',
        description: '雑談や気軽な会話のためのチャンネルです',
        type: 'channel',
      },
    }),
    prisma.channel.create({
      data: {
        name: 'お知らせ',
        description: '重要なお知らせを共有するチャンネルです',
        type: 'channel',
      },
    }),
    prisma.channel.create({ data: { type: 'dm' } }),
    prisma.channel.create({ data: { type: 'dm' } }),
    prisma.channel.create({ data: { type: 'dm' } }),
  ]);
  console.log(`${channels.length} 個のチャンネルを作成しました`);

  /**
   * チャンネルメンバーの追加
   */
  const channelMembers = await prisma.channelMember.createMany({
    data: [
      // 一般チャンネル
      { channelId: channels[0].id, userId: MY_USER_ID },
      { channelId: channels[0].id, userId: users[0].id },
      { channelId: channels[0].id, userId: users[1].id },
      { channelId: channels[0].id, userId: users[2].id },
      // ランダムチャンネル
      { channelId: channels[1].id, userId: MY_USER_ID },
      { channelId: channels[1].id, userId: users[0].id },
      { channelId: channels[1].id, userId: users[1].id },
      { channelId: channels[1].id, userId: users[2].id },
      // お知らせチャンネル
      { channelId: channels[2].id, userId: MY_USER_ID },
      { channelId: channels[2].id, userId: users[0].id },
      { channelId: channels[2].id, userId: users[1].id },
      { channelId: channels[2].id, userId: users[2].id },
      // DM チャンネル
      { channelId: channels[3].id, userId: MY_USER_ID },
      { channelId: channels[3].id, userId: users[0].id },
      { channelId: channels[4].id, userId: MY_USER_ID },
      { channelId: channels[4].id, userId: users[1].id },
      { channelId: channels[5].id, userId: MY_USER_ID },
      { channelId: channels[5].id, userId: users[2].id },
    ],
    skipDuplicates: true,
  });
  console.log(`${channelMembers.count} 個のチャンネルメンバー関係を作成しました`);

  /**
   * メッセージの作成
   */
  const messages = await prisma.message.createMany({
    data: [
      {
        channelId: channels[0].id,
        senderId: users[0].id,
        content: 'おはようございます！今日のミーティングは何時からでしたか？',
        createdAt: new Date('2025-03-23T09:30:00Z'),
      },
      {
        channelId: channels[0].id,
        senderId: users[1].id,
        content: 'おはようございます！10時からです。議題は先日のプロジェクト進捗についてです。',
        createdAt: new Date('2025-03-23T09:32:00Z'),
      },
      {
        channelId: channels[0].id,
        senderId: users[2].id,
        content: '資料は事前に共有しておきました。ご確認ください。',
        createdAt: new Date('2025-03-23T09:35:00Z'),
      },
      {
        channelId: channels[0].id,
        senderId: MY_USER_ID,
        content: 'ありがとうございます。確認しました。',
        createdAt: new Date('2025-03-23T09:40:00Z'),
      },
      {
        channelId: channels[3].id,
        senderId: MY_USER_ID,
        content: 'こんにちは！プロジェクトの進捗はどうですか？',
        createdAt: new Date('2025-03-23T14:30:00Z'),
      },
      {
        channelId: channels[3].id,
        senderId: users[0].id,
        content: '順調に進んでいます。明日までに完了する予定です。',
        createdAt: new Date('2025-03-23T14:32:00Z'),
      },
      {
        channelId: channels[3].id,
        senderId: MY_USER_ID,
        content: '素晴らしいですね。何か問題があれば教えてください。',
        createdAt: new Date('2025-03-23T14:35:00Z'),
      },
      {
        channelId: channels[4].id,
        senderId: users[1].id,
        content: '明日の会議の資料を送りました。',
        createdAt: new Date('2025-03-23T14:30:00Z'),
      },
      {
        channelId: channels[4].id,
        senderId: MY_USER_ID,
        content: 'ありがとうございます。確認しました。',
        createdAt: new Date('2025-03-23T14:32:00Z'),
      },
      {
        channelId: channels[5].id,
        senderId: MY_USER_ID,
        content: 'お疲れ様です！',
        createdAt: new Date('2025-03-23T14:35:00Z'),
      },
      {
        channelId: channels[5].id,
        senderId: users[2].id,
        content: 'お疲れ様です！今週もよろしくお願いします。',
        createdAt: new Date('2025-03-23T14:38:00Z'),
      },
    ],
    skipDuplicates: true,
  });
  console.log(`${messages.count} 個のメッセージを作成しました`);

  console.log('シードデータの作成が完了しました');
}

main()
  .catch((e) => {
    console.error('シードの実行中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
