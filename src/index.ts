import {getTestRuleFunction} from 'stylelint-rule-creator';
import {visibilityRule} from './rules/visibility/visibility.rule';

export const testRule = getTestRuleFunction({
    // a plugin must be supplied so that stylelint can find the rule you want to test
    // trying to use the configBasedir property in here instead of supplying a complete relative
    // path to index.js does NOT work. The stylelint api doesn't seem to even read that property.
    linterOptions: {config: {plugins: ['./dist/index.js']}},
});

export default [visibilityRule];
