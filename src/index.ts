import {testRule as baseTestRule, TestRuleInput} from 'stylelint-jest-rule-tester';
import {visibilityRule} from './rules/visibility/visibility.rule';

export function testRule<RuleOptionsType>(testRuleInput: TestRuleInput<RuleOptionsType>) {
    return baseTestRule({
        // a plugin must be supplied so that stylelint can find the rule you want to test
        // trying to use the configBasedir property in here instead of supplying a complete relative
        // path to index.js does NOT work. The stylelint api doesn't seem to even read that property.
        ...testRuleInput,
        linterOptions: {
            ...testRuleInput.linterOptions,
            config: {
                ...testRuleInput.linterOptions?.config,
                plugins: (testRuleInput.linterOptions?.config?.plugins || []).concat(
                    './dist/index.js',
                ),
            },
        },
    });
}

export default [visibilityRule];
