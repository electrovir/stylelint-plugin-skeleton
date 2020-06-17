import {Plugin, utils} from 'stylelint';
import {createRule, createRuleMessage} from '../../rule';

const ruleName = 'no-visibility-allowed';

const rule: Plugin = (
    primaryOption,
    secondaryOptions,
    context: {fix: boolean; newline: string} = {fix: false, newline: '\n'},
) => {
    return (root, result) => {
        if (!primaryOption) {
            return;
        }

        root.walkDecls(decl => {
            if (context.fix) {
                decl.remove();
            }
            if (decl.prop === 'visibility') {
                utils.report({
                    result,
                    ruleName,
                    message: createRuleMessage(
                        ruleName,
                        'Try not to use visibility: ' + decl.prop + ', ' + decl.value,
                    ),
                    node: decl,
                    word: decl.value,
                });
            }
        });
    };
};

export const visibilityRule = createRule(ruleName, rule);
