import {Plugin, utils} from 'stylelint';
import {createRule, createRuleMessage} from '../../rule';

/*
Example rule influenced by
https://www.codementor.io/@rudolfolah/stylelint-rules-how-to-write-your-own-rules-hhmwikafq
*/

const ruleName = 'skeleton/visibility';

const rule: Plugin = (
    primaryOption,
    extraOptions,
    context = {
        fix: false,
    },
) => {
    return (root, result) => {
        if (!primaryOption) {
            return;
        }

        root.walkDecls(decl => {
            if (decl.prop === 'visibility') {
                if (context.fix) {
                    decl.remove();
                } else {
                    utils.report({
                        result,
                        ruleName,
                        message: createRuleMessage(ruleName, 'Try not to use visibility'),
                        node: decl,
                        word: decl.value,
                    });
                }
            }
        });
    };
};

export const visibilityRule = createRule(ruleName, rule);
