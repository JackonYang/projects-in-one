
class BaseRule:
    text = None
    text_cleansed = None
    context = {}

    def __init__(self, text):
        self.text = text
        self.text_cleansed = text.replace(' ', '')

    def match(self):
        # text = self.text
        return False

    def reply_on_hit(self):
        return []

    def render_text_reply(self, text):
        return {
            'replyType': 'Text',
            'replyArgs': text,
        }

    def render_reply(self, reply):
        if isinstance(reply, str):
            return self.render_text_reply(reply)

        return reply

    def stop_on_hit(self):
        return True
