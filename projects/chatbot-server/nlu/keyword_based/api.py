import json
import logging

from .rules.rule_manager import RuleManager


logger = logging.getLogger(__name__)

mng = RuleManager()
mng.load_rules()


def get_reply_list(text):
    logger.debug('input: %s' % text)
    replys = mng.apply_rules(text) or []
    logger.info('input %s. response: %s' % (
       text, json.dumps(replys, indent=4, ensure_ascii=False)))

    return replys or []
