import typescript from '@rollup/plugin-typescript';
import dts        from 'rollup-plugin-dts';
import terser     from '@rollup/plugin-terser';

const isProduction = !process.env.ROLLUP_WATCH;

function basePlugins() {
    return [
        typescript({
            tsconfig: './tsconfig.json',
            // exclude tests from the build
            exclude: ['./tests/**'],
            // path alias resolution for @/* → src/*
            paths: { '@/*': ['./src/*'] },
        }),

        // minify if we're building for production
        // (aka. npm run build instead of npm run dev)
        isProduction && terser({
            keep_classnames: true,
            keep_fnames: true,
            output: {
                comments: false,
            },
        }),
    ].filter(Boolean);
}

export default [
    // ES bundle (the LSPocket client as default export + additional helper classes).
    {
        input: 'src/index.ts',
        output: [
            {
                file:      'dist/lspocket.es.mjs',
                format:    'es',
                sourcemap: isProduction,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // ES bundle but with .js extension.
    //
    // This is needed mainly because of React Native not recognizing the mjs
    // extension by default (see https://github.com/pocketbase/js-sdk/issues/47).
    {
        input: 'src/index.ts',
        output: [
            {
                file:      'dist/lspocket.es.js',
                format:    'es',
                sourcemap: isProduction,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // UMD bundle (only the LSPocket client as default export).
    {
        input: 'src/Client.ts',
        output: [
            {
                name:      'LSPocket',
                file:      'dist/lspocket.umd.js',
                format:    'umd',
                exports:   'default',
                sourcemap: isProduction,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // CommonJS bundle (only the LSPocket client as default export).
    {
        input: 'src/Client.ts',
        output: [
            {
                name:      'LSPocket',
                file:      'dist/lspocket.cjs.js',
                format:    'cjs',
                exports:   'default',
                sourcemap: isProduction,
            }
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // !!!
    // @deprecated - kept only for backwards compatibility and will be removed in v1.0.0
    // !!!
    //
    // Browser-friendly iife bundle (only the LSPocket client as default export).
    {
        input: 'src/Client.ts',
        output: [
            {
                name:      'LSPocket',
                file:      'dist/lspocket.iife.js',
                format:    'iife',
                sourcemap: isProduction,
            },
        ],
        plugins: basePlugins(),
        watch: { clearScreen: false },
    },

    // TypeScript declaration bundle for the ES module entry point.
    {
        input: 'src/index.ts',
        output: [
            {
                file:   'dist/lspocket.es.d.mts',
                format: 'es',
            },
        ],
        plugins: [
            dts({
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    paths: { '@/*': ['./src/*'] },
                },
            }),
        ],
        watch: { clearScreen: false },
    },
];
