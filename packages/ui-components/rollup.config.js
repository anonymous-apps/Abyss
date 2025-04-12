import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
        }),
        postcss({
            config: {
                path: './postcss.config.js',
            },
            extensions: ['.css'],
            minimize: true,
            inject: {
                insertAt: 'top',
            },
        }),
    ],
};
