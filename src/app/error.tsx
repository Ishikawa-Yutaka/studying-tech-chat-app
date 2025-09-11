'use client';

export default function Error() {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">アプリケーションエラー</h2>
          <p className="text-muted-foreground mb-6">
            予期しないエラーが発生しました。お手数ですが、もう一度やり直してください。
          </p>
        </div>
      </body>
    </html>
  );
}
