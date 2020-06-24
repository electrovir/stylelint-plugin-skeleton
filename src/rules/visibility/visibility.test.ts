import {testRule} from '../../test-rule';
import {visibilityRule} from './visibility.rule';

testRule({
    ruleName: visibilityRule.ruleName,
    ruleOptions: [true],
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
            message: 'Try not to use visibility (skeleton/visibility)',
        },
    ],
});
