import { cn } from './utils';

describe('cn function', () => {
  test('正しくクラス名をマージできること', () => {
    // 基本的なクラス結合のテスト
    expect(cn('text-red-500', 'bg-blue-200')).toBe('text-red-500 bg-blue-200');

    // 条件付きクラスのテスト
    expect(cn('base-class', true && 'active', false && 'disabled')).toBe('base-class active');

    // 配列を含むテスト
    expect(cn('flex', ['p-2', 'mx-4'])).toBe('flex p-2 mx-4');

    // 重複するクラスのテスト (tailwind-merge の機能)
    expect(cn('p-2 p-4')).toBe('p-4');

    // tailwind の競合するクラスのマージテスト
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
