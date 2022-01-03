from .simple_rule import SimpleRule


class RuleManager:

    active_rules = [
        SimpleRule,
    ]

    def load_rules(self):
        pass

    def apply_rules(self, text):
        replys = []
        for rule_class in self.active_rules:
            rule_obj = rule_class(text)
            if rule_obj.match():
                replys.extend(rule_obj.reply_on_hit())

                if rule_obj.stop_on_hit():
                    break

        return replys
