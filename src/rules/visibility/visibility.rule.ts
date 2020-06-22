import {Plugin, utils} from 'stylelint';
import {createRule, createRuleMessage} from '../../rule';

const ruleName = 'skeleton/visibility';

const rule: Plugin = (
    primaryOption,
    options,
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

export const orderRule = createRule(ruleName, rule);
