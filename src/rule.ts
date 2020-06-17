import {Plugin, createPlugin, utils} from 'stylelint';
import {pluginPrefix} from '.';

export type Rule = {
    ruleName: string;
    rule: Plugin;
};

export function createRuleMessage(ruleName: string, message: string): string {
    return utils.ruleMessages(ruleName, {whatever: () => message}).whatever();
}

export function createRule(ruleName: string, ruleCallback: Plugin): Rule {
    return {
        ruleName: `${pluginPrefix}/${ruleName}`,
        rule: createPlugin(ruleName, ruleCallback),
    };
}
