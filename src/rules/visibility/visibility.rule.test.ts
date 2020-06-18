import {testRule} from '../test-rule';
import {visibilityRule} from './visibility.rule';

console.log('visibilityRule', visibilityRule);

testRule({
    ruleName: visibilityRule.ruleName,
    plugins: ['./index.js'],
    config: [true],
    fix: true,
    accept: [
        {
            code: 'a { color: pink; }',
        },
    ],
    reject: [
        {
            code: 'a { color: pink; visibility: hidden; }',
            fixed: 'a { color: pink; }',
            message: 'what',
        },
    ],
});
