from .base_rule import BaseRule


rule_configs = [
    {
        'keywords': [
            '快乐十分',
            '快乐10分',
            '快十',
            '快10',
            '快乐十',
            '快乐10',
        ],
        'reply_on_hit': [
            '快乐十分退市了，不能玩了。😂 ',
            '其他都还开着。快乐8，3D，双色球，七乐彩，都可以买。想玩啥，我发给你发走势图！',
            '快乐 8 的玩法最接近快乐十分，来一把试一试？[Respect] ',
        ],
    },
    {
        'keywords': [
            '走势图',
        ],
        'reply_on_hit': [
            {
                'replyType': 'UrlLink',
                'replyArgs': {
                    'description': '最新走势图超市大全',
                    'thumbnailUrl': 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
                    'title': '站点福音 彩民最爱 每期必看',
                    'url': 'https://mp.weixin.qq.com/s/uZwPhe9ETmAiWwIBMURJSA',
                },
            }
        ],
    },
]


class SimpleRule(BaseRule):
    def match(self):
        text = self.text
        text_cleansed = self.text_cleansed

        for rule in rule_configs:
            for keyword in rule.get('keywords', []):
                if keyword in text or keyword in text_cleansed:
                    self.hit_rule = rule
                    return True

        return False

    def reply_on_hit(self):
        if not self.hit_rule:
            return

        reply_on_hit = self.hit_rule.get('reply_on_hit', [])
        return [self.render_reply(t) for t in reply_on_hit]
