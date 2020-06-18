import * as getTestRule from 'jest-preset-stylelint/getTestRule';

type ruleTestOptions = {
    accept: TestCase[];
    config: any[];
    fix?: boolean;
    plugins?: string[];
    reject: RejectTestCase[];
    ruleName: string;
    skipBasicChecks?: boolean;
    syntax?: string;
};

type TestCase = {
    code: string;
    description?: string;
    skip?: boolean;
    only?: boolean;
};

type RejectTestCase = TestCase & {
    column?: number;
    fixed?: string;
    line?: number;
    message?: string;
    unfixable?: boolean;
    warnings?: WarningMessage[];
};

type WarningMessage = {
    message: string;
    line: number;
    column: number;
};

export const testRule: (options: ruleTestOptions) => void = getTestRule({
    plugins: ['./dist/index.js'],
});
