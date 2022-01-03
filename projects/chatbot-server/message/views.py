from rest_framework.decorators import api_view
# from rest_framework.response import Response
from django.http import JsonResponse

from .data_manager import db_data

from configs import (
    demo_chat_uid,
    demo_owner_uid,
)

system_max_results = 500


@api_view(['GET', 'POST'])
def message_list(request):
    pagination_token = request.query_params.get('pagination_token')
    chat_uid = request.query_params.get('chat-uid')
    # chat_uid = demo_chat_uid
    # TODO get owner_uid from request
    owner_uid = demo_owner_uid

    try:
        max_results = int(request.query_params.get('max_results') or int('100'))
    except Exception:
        max_results = 100

    start_idx = 0
    if pagination_token is not None:
        start_idx = db_data['pagination_token2seq'].get(pagination_token, -1) + 1

    end_idx = min(max_results, system_max_results) + start_idx

    user_chats = db_data['chats'][owner_uid]
    if not chat_uid or chat_uid not in user_chats:
        return error_request('invalid chat-uid: %s' % chat_uid)

    items_all = user_chats[chat_uid]
    items = items_all[start_idx: end_idx]

    sorted_items = sorted(items, key=lambda x: x['timestamp'], reverse=False)
    item_order = [i['id'] for i in sorted_items]
    item_dict = {i['id']: i for i in sorted_items}

    next_token = items_all[end_idx]['id'] if end_idx < len(items_all) else None

    try:
        result = {
            'data': item_dict,
            'item_order': item_order,
            "meta": {
                "oldest_id": start_idx,
                "newest_id": end_idx,
                "result_count": len(item_order),
                "next_token": next_token
            }
        }

        return JsonResponse(result)
    except Exception as e:
        return error(e)


@api_view(['GET', 'POST'])
def get_user_chats(request):
    # clear_db_chats()
    # load_db()

    # TODO: get owner_uid from request
    owner_uid = demo_owner_uid

    # print(db_data['chats'].keys())
    user_chats = db_data['chats'][owner_uid]

    latest_msg = {
        uid: msg[-1] for uid, msg in user_chats.items()
    }

    # sort latest_msg
    sorted_latest_msg = sorted(latest_msg.items(), key=lambda x: x[1]['timestamp'], reverse=True)

    uidOrder = [uid for uid, _ in sorted_latest_msg]

    user_info = {uid: db_data['user_info'][uid] for uid in uidOrder}

    try:
        result = {
            'data': {
                'userInfo': user_info,
                'latestMsg': latest_msg,
            },
            'itemOrder': uidOrder,
            "meta": {
                # "oldest_id": start_idx,
                # "newest_id": end_idx,
                # "result_count": len(item_order),
                # "next_token": next_token
            }
        }

        return JsonResponse(result)
    except Exception as e:
        return error(e)


def error(exc):
    res = JsonResponse({
        "msg": "internal server error",
        "exc": str(exc),
    })
    res.status_code = 500
    return res


def error_request(msg):
    res = JsonResponse({
        "msg": "invalid request: %s" % msg
    })
    res.status_code = 400
    return res
