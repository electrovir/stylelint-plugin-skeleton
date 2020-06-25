import {getTestRuleFunction} from 'stylelint-jest-rule-tester';
import {visibilityRule} from './visibility.rule';

const testRule = getTestRuleFunction({
    // a plugin must be supplied so that stylelint can find the rule you want to test
    // trying to use the configBasedir property in here instead of supplying a complete relative
    // path to index.js does NOT work. The stylelint api doesn't seem to even read that property.
    linterOptions: {config: {plugins: ['./dist/index.js']}},
});

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
            message: visibilityRule.messages.noUseVisibility(),
        },
    ],
});
