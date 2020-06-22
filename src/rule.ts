import {createPlugin, Plugin, utils} from 'stylelint';

export type Rule = {
    ruleName: string;
    rule: Plugin;
};

export function createRuleMessage(ruleName: string, message: string): string {
    return utils.ruleMessages(ruleName, {whatever: () => message}).whatever();
}

export function createRule(inputRuleName: string, ruleCallback: Plugin): Rule {
    return createPlugin(inputRuleName, ruleCallback);
}
