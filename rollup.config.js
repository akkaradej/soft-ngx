import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
// import commonjs from 'rollup-plugin-commonjs';
// plugins: [
//     commonjs({
//         include: [
//             'node_modules/lib-name/**'
//         ]
//     })
// ]

/**
 * Add here external dependencies that actually you use.
 * 
 * About RxJS
 * From RxJS v6 you need only 'rxjs' and 'rxjs.operators'.
 */
const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/common/http': 'ng.common.http',
    '@angular/forms': 'ng.forms',

    'rxjs': 'rxjs',
    'rxjs/operators': 'rxjs.operators',

    'angular2-promise-buttons': 'angular2-promise-buttons',
    'moment': 'moment',
    'ng2-bootstrap-modal': 'ng2-bootstrap-modal',
};

export default {
    external: Object.keys(globals),
    plugins: [
        resolve(),
        sourcemaps()
    ],
    onwarn: () => { return },
    output: {
        format: 'umd',
        name: 'ng.softNgx',
        globals: globals,
        sourcemap: true,
        exports: 'named'
    }
}
