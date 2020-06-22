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
    configBasedir: 'dist',
});

'use strict';

const util = require('util');
const {basicChecks, lint} = require('stylelint');

function getTestRule(options: any) {
    return function testRule(schema: any) {
        describe(`${schema.ruleName}`, () => {
            const stylelintConfig = {
                plugins: options.plugins || schema.plugins,

                configBasedir: 'dist',
                rules: {
                    [schema.ruleName]: schema.config,
                },
            };

            let passingTestCases = schema.accept || [];

            if (!schema.skipBasicChecks) {
                passingTestCases = passingTestCases.concat(basicChecks);
            }

            setupTestCases({
                name: 'accept',
                cases: passingTestCases,
                schema,
                comparisons: (testCase: any) => async () => {
                    const options = {
                        code: testCase.code,
                        config: stylelintConfig,
                        syntax: schema.syntax,
                        configBasedir: 'dist',
                    };

                    const output = await lint(options);

                    expect(output.results[0].warnings).toEqual([]);
                    expect(output.results[0].parseErrors).toEqual([]);

                    if (!schema.fix) {
                        return;
                    }

                    // Check that --fix doesn't change code
                    const outputAfterFix = await lint({...options, fix: true});
                    const fixedCode = getOutputCss(outputAfterFix);

                    expect(fixedCode).toBe(testCase.code);
                },
            });

            setupTestCases({
                name: 'reject',
                cases: schema.reject,
                schema,
                comparisons: (testCase: any) => async () => {
                    const options = {
                        code: testCase.code,
                        config: stylelintConfig,
                        syntax: schema.syntax,
                        configBasedir: 'dist',
                    };

                    const outputAfterLint = await lint(options);

                    const actualWarnings = outputAfterLint.results[0].warnings;

                    expect(outputAfterLint.results[0].parseErrors).toEqual([]);
                    expect(actualWarnings).toHaveLength(
                        testCase.warnings ? testCase.warnings.length : 1,
                    );

                    (testCase.warnings || [testCase]).forEach((expected: any, i: any) => {
                        const warning = actualWarnings[i];

                        expect(expected.message).toBeTruthy();

                        expect(warning.text).toBe(expected.message);

                        if (expected.line !== undefined) {
                            expect(warning.line).toBe(expected.line);
                        }

                        if (expected.column !== undefined) {
                            expect(warning.column).toBe(expected.column);
                        }
                    });

                    if (!schema.fix) {
                        return;
                    }

                    // Check that --fix doesn't change code
                    if (
                        schema.fix &&
                        !testCase.fixed &&
                        testCase.fixed !== '' &&
                        !testCase.unfixable
                    ) {
                        throw new Error(
                            'If using { fix: true } in test schema, all reject cases must have { fixed: .. }',
                        );
                    }

                    const outputAfterFix = await lint({...options, fix: true});

                    const fixedCode = getOutputCss(outputAfterFix);

                    if (!testCase.unfixable) {
                        expect(fixedCode).toBe(testCase.fixed);
                        expect(fixedCode).not.toBe(testCase.code);
                    } else {
                        // can't fix
                        if (testCase.fixed) {
                            expect(fixedCode).toBe(testCase.fixed);
                        }

                        expect(fixedCode).toBe(testCase.code);
                    }

                    // Checks whether only errors other than those fixed are reported
                    const outputAfterLintOnFixedCode = await lint({
                        ...options,
                        code: fixedCode,
                    });

                    expect(outputAfterLintOnFixedCode.results[0].warnings).toEqual(
                        outputAfterFix.results[0].warnings,
                    );
                    expect(outputAfterLintOnFixedCode.results[0].parseErrors).toEqual([]);
                },
            });
        });
    };

    function setupTestCases({name, cases, schema, comparisons}: any) {
        if (cases && cases.length) {
            describe(name, () => {
                cases.forEach((testCase: any) => {
                    if (testCase) {
                        const spec = testCase.only ? it.only : testCase.skip ? it.skip : it;

                        describe(`${util.inspect(schema.config)}`, () => {
                            describe(`${util.inspect(testCase.code)}`, () => {
                                spec(
                                    testCase.description || 'no description',
                                    comparisons(testCase),
                                );
                            });
                        });
                    }
                });
            });
        }
    }

    function getOutputCss(output: any) {
        const result = output.results[0]._postcssResult;
        const css = result.root.toString(result.opts.syntax);

        return css;
    }
}
