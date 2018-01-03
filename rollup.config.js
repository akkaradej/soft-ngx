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
 * Each RxJS functionality that you use in the library must be added as external dependency.
 * - For main classes use 'Rx':
 *      e.g. import { Observable } from 'rxjs/Observable'; => 'rxjs/Observable': 'Rx'
 * - For observable methods use 'Rx.Observable':
 *      e.g. import 'rxjs/add/observable/merge'; => 'rxjs/add/observable/merge': 'Rx.Observable'
 *      or for lettable operators:
 *      e.g. import { merge } from 'rxjs/observable/merge'; => 'rxjs/observable/merge': 'Rx.Observable'
 * - For operators use 'Rx.Observable.prototype':
 *      e.g. import 'rxjs/add/operator/map'; => 'rxjs/add/operator/map': 'Rx.Observable.prototype'
 *      or for lettable operators:
 *      e.g. import { map } from 'rxjs/operators'; => 'rxjs/operators': 'Rx.Observable.prototype'
 */
const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/common/http': 'ng.common.http',
    '@angular/forms': 'ng.forms',
    
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/observable/merge': 'Rx.Observable',
    'rxjs/observable/throw': 'Rx.Observable',
    'rxjs/observable/empty': 'Rx.Observable',
    'rxjs/observable/fromPromise': 'Rx.Observable',
    'rxjs/observable/of': 'Rx.Observable',
    'rxjs/operators': 'Rx.Observable.prototype',

    'angular-oauth2-oidc': 'angular-oauth2-oidc',
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
