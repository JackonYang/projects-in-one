import json
import os

from configs import daily_data_root

from .msg_formatter_wechat import format_msg


db_data = {
    'chats': {},
    'user_info': {},
    'pagination_token2seq': {},
}
processed = set()


def clear_db_chats():
    db_data['chats'] = {}
    processed.clear()


def load_db():
    chats = db_data['chats']  # uid: message_list
    user_info = db_data['user_info']  # uid: contact info dict

    for msg_file, msg_path in iter_msg_file():

        # print('processing: %s' % msg_file)

        with open(msg_path, 'r', encoding='utf-8') as fr:
            msg_info = format_msg(json.load(fr))

        if not msg_info:  # skip message
            continue

        # process 1-1 message only, ignore group message
        from_user = msg_info['from']
        to_user = msg_info['to']

        if not to_user:
            continue

        # init data structure
        for user in [from_user, to_user]:
            uid = user['id']

            # ensure user info exists
            if uid not in user_info:
                user_info[uid] = user

            # ensure user chats exists
            if uid not in chats:
                chats[uid] = {}

        from_uid = from_user['id']
        to_uid = to_user['id']

        from_user_chats = chats[from_uid]
        if to_uid not in from_user_chats:
            from_user_chats[to_uid] = []
        from_user_chats[to_uid].append(msg_info)

        to_user_chats = chats[to_uid]
        if from_uid not in to_user_chats:
            to_user_chats[from_uid] = []
        to_user_chats[from_uid].append(msg_info)

    # sort
    for owner_uid, user_chats in chats.items():
        for chat_uid, messages in user_chats.items():
            chats[owner_uid][chat_uid] = sorted(messages, key=lambda x: x['timestamp'], reverse=False)


def iter_msg_file():
    # latest 2 days
    to_process = list(sorted(os.listdir(daily_data_root)))[-2:]

    for daily_dir in to_process:
        daily_dirpath = os.path.join(daily_data_root, daily_dir, 'message')
        if os.path.exists(daily_dirpath):
            for msg_file in os.listdir(daily_dirpath):

                if msg_file in processed:
                    continue

                processed.add(msg_file)
                yield msg_file, os.path.join(daily_dirpath, msg_file)


load_db()
