import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    ignores: ['data/'],
    typescript: true,
    astro: true,
    solid: true,
    unocss: true,
    rules: {
        'curly': ['error', 'multi-line'],
        'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'n/prefer-global/buffer': 'off',
        'style/quotes': ['error', 'single', { avoidEscape: true }],
        'test/consistent-test-it': 'off',
        'test/prefer-lowercase-title': 'off',
        'antfu/if-newline': 'off',
        'style/max-statements-per-line': ['error', { max: 2 }],
        'ts/no-redeclare': 'off',
        'node/prefer-global/process': 'off',
    },
})
