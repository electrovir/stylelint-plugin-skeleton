import {createPlugin, Plugin, utils} from 'stylelint';

export type Rule<MessageType> = {
    ruleName: string;
    rule: Plugin;
    messages: MessageType;
};

export type BaseMessageType = {
    [key: string]: () => string;
};

export function createRuleMessage(ruleName: string, message: string): string {
    return utils.ruleMessages(ruleName, {whatever: () => message}).whatever();
}

export function createRule<MessageType extends BaseMessageType>(
    inputRuleName: string,
    ruleCallback: Plugin,
    messages: MessageType,
): Rule<MessageType> {
    const rule = createPlugin(inputRuleName, ruleCallback);
    rule.messages = messages;
    return rule;
}
