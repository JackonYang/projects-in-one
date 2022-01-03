import copy
import re

transfer_ptn = re.compile(r'收到转账(.+)元')
transfer_subtype_ptn = re.compile(r'<paysubtype>(.+)</paysubtype>')


def format_msg(msg):
    new_msg = copy.deepcopy(msg)
    new_msg['brief'] = '未知信息'

    # system message, drop
    if msg['typeName'] in [
        'Unknown',
    ]:
        return

    if msg['typeName'] == 'Transfer':
        money = transfer_ptn.findall(msg['text'])[0]
        transfer_subtype = transfer_subtype_ptn.findall(msg['text'])[0]
        new_msg['money'] = money

        transfer_subtype_name = 'send' if int(transfer_subtype) == 1 else 'rec'
        new_msg['transfer_subtype'] = transfer_subtype_name

        if transfer_subtype_name == 'send':
            brief = '转账给你 %.2f 元' % float(money)
        else:
            brief = '已收钱 %.2f 元' % float(money)
        new_msg['brief'] = brief.strip()

    elif msg['typeName'] == 'Text':
        new_msg['brief'] = msg['text'].strip()[:20]

    elif msg['typeName'] == 'RedEnvelope':
        new_msg['brief'] = '[红包]🧧 收到红包，无法查看价格'

    elif msg['typeName'] == 'Image':
        new_msg['brief'] = '[图片]'

    elif msg['typeName'] == 'Video':
        new_msg['brief'] = '[视频]'

    elif msg['typeName'] == 'Audio':
        new_msg['brief'] = '[语音]'

    else:
        new_msg['brief'] = '不支持的消息<%s>' % msg['typeName']

    return new_msg
